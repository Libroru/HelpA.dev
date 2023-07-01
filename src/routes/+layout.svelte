<script>
	import '../app.scss';
	import './styles.css';
</script>

<div class="app">
	<nav class="navbar navbar-light bg-light p-2">
		<a class="navbar-brand" href="/">HelpA.dev</a>
		<form class="d-inline-flex">
			<input class="form-control mx-2" type="search" placeholder="Search" aria-label="Search">
			<button class="btn btn-outline-success" type="submit">Search</button>
		</form>
	</nav>

	<main>
		<slot />
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
