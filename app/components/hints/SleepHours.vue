<template>
	<Page @shownModally="onShownModally">
		<StackLayout orientation="vertical" class="p-20" width="100%">
			<Label class="h3" text="Dauer des Schlafs"></Label>
			<Label textWrap="true" class="p m-t-15">Wie lange hast du in der Nacht geschlafen? Es geht dabei um durchgehenden Schlaf und nicht um Nickerchen.</Label>
			<Label textWrap="true" class="p m-t-20">Ein ausgewogenes Maß an regelmäßigem Schlaf ist für deine Gesundheit wichtig.</Label>
		</StackLayout>
	</Page>
</template>
<script>

    export default {
		data: () => {
			return {
			}
		},
		methods: {
			onShownModally() {

			}
		}
	}
</script>
<style scoped lang="scss">
	// Start custom common variables
	@import "~@nativescript/theme/scss/variables/blue";
	// End custom common variables
</style>
