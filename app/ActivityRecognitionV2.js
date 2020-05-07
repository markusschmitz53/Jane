const { Observable } = require("data/observable");
const application = require('application');

const OnSuccessListener = com.google.android.play.core.tasks.OnSuccessListener;
const OnFailureListener = com.google.android.play.core.tasks.OnFailureListener;
const GoogleApiClient = com.google.android.gms.common.api.GoogleApiClient;
const ActivityRecognition = com.google.android.gms.location.ActivityRecognition;
const ActivityRecognitionClient = com.google.android.gms.location.ActivityRecognitionClient;
const ActivityTransition = com.google.android.gms.location.ActivityTransition;
const ActivityTransitionRequest = com.google.android.gms.location.ActivityTransitionRequest;
const ActivityTransitionResult = com.google.android.gms.location.ActivityTransitionResult;
const ActivityRecognitionResult = com.google.android.gms.location.ActivityRecognitionResult;
const DetectedActivity = com.google.android.gms.location.DetectedActivity;

const activityEvent = "activity-event";
const ACTIVITY_TYPE = {
	IN_VEHICLE: DetectedActivity.IN_VEHICLE,
	ON_BICYCLE: DetectedActivity.ON_BICYCLE,
	ON_FOOT: 	DetectedActivity.ON_FOOT,
	STILL: DetectedActivity.STILL,
	UNKNOWN: DetectedActivity.UNKNOWN,
	RUNNING: DetectedActivity.RUNNING,
	WALKING: DetectedActivity.WALKING,
	TILTING: DetectedActivity.TILTING
};

var instance;

com.pip3r4o.android.app.IntentService.extend('de.markusschmitz.ActivityIntentService', {
	onHandleIntent: function (intent) {
		if (instance) {
			if (ActivityTransitionResult.hasResult(intent)) {
				let result = ActivityTransitionResult.extractResult(intent);
				let events = result.transitionEvents.toArray();

                if (events && events.length) {
                    let event;
                    while (event = events.pop()) {
                        let transitionType = event.getTransitionType();
                        let activityType = event.getActivityType();
                        instance.notifyActivity(activityType, transitionType);
                    }
                }
			}
		}
	}
});

class NativeActivityRecognition extends Observable {

	constructor() {
	    super();

	    console.info('# Constructed NativeActivityRecognition');

		this.context = application.android.context;

		let transitions = new java.util.ArrayList(8);

        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.STILL)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());

        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.STILL)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

       transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.UNKNOWN)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());

        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.UNKNOWN)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

       transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.TILTING)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());

        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.TILTING)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());

       transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.ON_FOOT)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_ENTER)
            .build());

        transitions.add(new ActivityTransition.Builder()
            .setActivityType(DetectedActivity.ON_FOOT)
            .setActivityTransition(ActivityTransition.ACTIVITY_TRANSITION_EXIT)
            .build());


		let intent = new android.content.Intent(this.context, de.markusschmitz.ActivityIntentService.class);
		this.activityReconPendingIntent = android.app.PendingIntent.getService(this.context, 0, intent, android.app.PendingIntent.FLAG_UPDATE_CURRENT);
		this.activityTransitionRequest = new ActivityTransitionRequest(transitions);
	}

	start(context) {
		if (context) {
			this.context = context;
		}

		console.info('# Started NativeActivityRecognition');

		this.apiClient = new GoogleApiClient.Builder(this.context)
		.addConnectionCallbacks(new GoogleApiClient.ConnectionCallbacks({
			onConnected: this.onConnected.bind(this),
			onConnectionSuspended: function() {
				console.error("# Activity Detection: connection suspended");
			}.bind(this)
		}))
		.addOnConnectionFailedListener(new GoogleApiClient.OnConnectionFailedListener({
			onConnectionFailed: function() {
				console.error("# Activity Detection: connection failed");
			}.bind(this)
		}))
		.addApi(ActivityRecognition.API)
		.build();

		this.apiClient.connect();
	}

	stop() {
		ActivityRecognition.getClient(this.context).removeActivityTransitionUpdates(this.activityReconPendingIntent);
	}

	onConnected() {
	    console.info('# Activity Detection: connected')
	    ActivityRecognition.getClient(this.context).requestActivityTransitionUpdates(this.activityTransitionRequest, this.activityReconPendingIntent);
	}

	notifyActivity(_activityType, _transitionType) {
	    console.info(_activityType, _transitionType);
		this.notify({
			eventName: activityEvent,
			activity: {
				type: _activityType,
				transition: _transitionType
			}
		});
	}
}

module.exports = {
	getInstance: function () {
		if (!instance) {
			instance = new NativeActivityRecognition();
		}

		return instance;
	},
	TYPE: ACTIVITY_TYPE,
	activityEvent: activityEvent
};