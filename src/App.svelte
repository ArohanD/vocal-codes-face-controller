<script>
	import { onMount } from "svelte";
	import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
	//import "@tensorflow/tfjs-backend-webgl";
	//import "@tensorflow/tfjs-backend-cpu";
	import * as tf from "@tensorflow/tfjs";

	let videoElement;

	onMount(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
				facingMode: "user",
			});

			videoElement.srcObject = stream;
			await videoElement.play();

			console.log(videoElement)
			runFaceDetector()

		} catch (e) {
			console.error(e);
		}
	});

	const runFaceDetector = async () => {
		const net =  await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh);
		setInterval(() => {
			detectFace(net)
		}, 10);
	};

	const detectFace = async(net) => {
		
		const face = await net.estimateFaces({
			input: videoElement
		})
		console.log(face)
	}
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

<!-- svelte-ignore a11y-media-has-caption -->
<main><video bind:this={videoElement} width="600" height="480" /></main>
