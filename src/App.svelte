<script>
	import { onMount } from "svelte";

	let videoEl;

	onMount(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
				facingMode: "user",
			});

			videoEl.srcObject = stream;
			videoEl.play();
		} catch (e) {
			console.error(e);
		}
	});
</script>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	video {
		-webkit-transform: scaleX(-1);
		transform: scaleX(-1);
	}
</style>

<main><video bind:this={videoEl} width="600" height="480" /></main>
