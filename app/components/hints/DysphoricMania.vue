<template>
	<Page @shownModally="onShownModally">
		<StackLayout orientation="vertical" class="p-20" width="100%">
			<Label class="h3" text="Gereizte Manie"></Label>
			<Label textWrap="true" class="p m-t-15" text="Eine gereizte oder dysphorische (Hypo) Manie zeichnet sich durch gesteigerten Antrieb und gedrückte Stimmung mit Wut oder Aggressivität aus."></Label>
			<Label textWrap="true" class="p m-t-20" text="Sie tritt zeitweise bei einem von vier Menschen mit bipolarer Störung auf."></Label>
		</StackLayout>
	</Page>
</template>
<script>

    export default {
    	props: ["currentValue"],
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
