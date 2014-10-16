<!DOCTYPE html>
<html>
<?php
	$cachebust = include('cachebust.php');
	$dev = ($_SERVER['HTTP_HOST'] == 'localhost' ? true : false);
?>
	<head>
		<title>Helm, 108</title>
		<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
		<link rel="icon" href="favicon.ico" type="image/x-icon">
		<link rel="stylesheet" type="text/css" href="assets/styles/css/main.css?v=<?php echo $cachebust; ?>" async />

		<script>
			document.documentElement.className = document.documentElement.className.replace(/no-js/,'js');
		</script>

	</head>
	<body <?php if($dev === true){ echo('data-debug="true"'); }else{ echo('data-prod="1"'); } ?> class="loading">



		<script type="x/template" data-template="Game">
			<div class="game game-container">
				<div class="game-ui"></div>
				<div class="game-display"></div>
			<div>
		</script>

		<script type="x/template" data-template="MainMenu">
			<div class="game-menu main-menu">
				<h1>Main Menu</h1>
				<ul class="menu-list"></ul>
			</div>
		</script>

		<script type="x/template" data-template="Menu">
			<div class="game-menu">
				<h1>Generic menu</h1>
				<ul class="menu-list"></ul>
			</div>
		</script>


		<!-- shaders -->

		<script type="application/x-glsl" id="sky-vertex">
			varying vec2 vUV;

			void main() {
			  vUV = uv;
			  vec4 pos = vec4(position, 1.0);
			  gl_Position = projectionMatrix * modelViewMatrix * pos;
			}
		</script>

		<script type="application/x-glsl" id="sky-fragment">
			uniform sampler2D texture;
			varying vec2 vUV;

			void main() {
			  vec4 sample = texture2D(texture, vUV);
			  gl_FragColor = vec4(sample.xyz, sample.w);
			}
		</script>

		<!-- end shaders -->

		<?php if($dev === true){ ?>
			<script src="assets/scripts/src/lib/jquery.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/threejs/three.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/physi.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/stats.min.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/threejs/threex.windowresize.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/threejs/threex.fullscreen.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/threejs/threex.keyboardstate.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/threejs/Detector.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/threejs/TrackballControls.js?v=<?php echo($cachebust); ?>" defer></script>
			<script src="assets/scripts/src/lib/threejs/OrbitControls.js?v=<?php echo($cachebust); ?>" defer></script>
		    <script data-main="assets/scripts/build/main.js?v=<?php echo($cachebust); ?>" src="assets/scripts/src/lib/require.js?v=<?php echo($cachebust); ?>" defer></script>
		<?php }else{ ?>
			<script src="assets/scripts/min/plugins.min.js?v=<?php echo($cachebust); ?>" defer></script>
		    <script data-main="assets/scripts/min/main.js" src="assets/scripts/min/require.js?v=<?php echo($cachebust); ?>" defer></script>
		<?php } ?>
	</body>

	<!--		__
	           / _)
	    .-^^^-/ /
	 __/       /
	<__.|_|-|_|
	 -->
</html>