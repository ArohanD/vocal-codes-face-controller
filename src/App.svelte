<script>
	import { onMount } from "svelte";
	import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
	//import "@tensorflow/tfjs-backend-webgl";
	//import "@tensorflow/tfjs-backend-cpu";
	import * as tf from "@tensorflow/tfjs";
	import calculateMode from "./utils/calculateMode";

	let sensitivity = 30;
	let pointerLeft = 50;
	let pointerTop = 50;
	let pointerSpeed = 2;

	let videoElement;
	let pointerCalibrated;
	let calibrationSet = [];
	let position = {
		x: 0,
		y: 0,
		z: 0,
	};
	let baseline = {
		x: 0,
		y: 0,
		z: 0,
	};

	onMount(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: true,
				audio: false,
				facingMode: "user",
			});

			videoElement.srcObject = stream;
			await videoElement.play();

			console.log("Video has loaded");
			runFaceDetector();
		} catch (e) {
			console.error(e);
		}
	});

	const runFaceDetector = async () => {
		const net = await faceLandmarksDetection.load(
			faceLandmarksDetection.SupportedPackages.mediapipeFacemesh
		);
		setInterval(() => {
			detectFace(net);
		}, 10);
	};

	const detectFace = async (net) => {
		const face = await net.estimateFaces({
			input: videoElement,
		});
		if(face[0]){
			const landmarkArray = face[0].annotations.noseTip[0];
			//console.log(landmarkArray);
			//console.log(face[0].annotations.noseTip.toString())
			position = {
				x: landmarkArray[0],
				y: landmarkArray[1],
				z: landmarkArray[2],
			};
			if (calibrationSet.length < 100)
				calibrationSet = [...calibrationSet, position];
		}
	};

	$: {
		if (!pointerCalibrated && calibrationSet.length === 100) {
			console.log("Calculating Baseline...");
			const xPositions = [],
				yPositions = [],
				zPositions = [];
			calibrationSet.forEach((positionArray) => {
				Math.round(xPositions.push(positionArray.x))
				Math.round(yPositions.push(positionArray.y))
				Math.round(zPositions.push(positionArray.z))
			});
			baseline = {
				x: calculateMode(xPositions),
				y: calculateMode(yPositions),
				z: calculateMode(zPositions),
			};
			pointerCalibrated = true;
		}
	}

	$: if(pointerCalibrated) {
		const xChange = position.x - baseline.x;
		const yChange = position.y - baseline.y;

		switch (true) {
			case (xChange > 0 && Math.abs(xChange) > sensitivity):
				pointerLeft -= 2;
				break;
			case (xChange < 0 && Math.abs(xChange) > sensitivity):
				pointerLeft += 2;
				break;
			default:
		}

		switch (true) {
			case (yChange > 0 && Math.abs(yChange) > sensitivity):
				pointerTop += 2;
				break;
			case (yChange < 0 && Math.abs(yChange) > sensitivity):
				pointerTop -= 2;
				break;
			default:
		}
	}
</script>

<style>
	main {
		text-align: center;
		padding: 1em;

		margin: 0 auto;
	}

	video {
		-webkit-transform: scaleX(-1);
		transform: scaleX(-1);
	}

	#pointer {
		position: absolute;
		top: 50%;
		left: 50%;
	}

	#posiiton-tracker {
		position: absolute;
		bottom: 10%;
		left: 50%;
	}
</style>

<!-- svelte-ignore a11y-media-has-caption -->
<main>
	<video bind:this={videoElement} width="600" height="480" />
	<div id="pointer" style={`top: ${pointerTop}%; left: ${pointerLeft}%`} >👃🏾</div>
	<div id="position-tracker">
		{#if !pointerCalibrated}
			{`Calibrating...`}
		{:else}
			<p>{`position: x:${Math.round(position.x)}, y:${Math.round(position.y)}, z:${Math.round(position.z)}`}</p>
			<p>{`baseline: x:${Math.round(baseline.x)}, y:${Math.round(baseline.y)}, z:${Math.round(baseline.z)}`}</p>
		{/if}
	</div>
</main>
