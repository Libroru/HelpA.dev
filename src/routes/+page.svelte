<script lang="ts">
	import Question from '$lib/components/Question.svelte';

	import { initializeApp } from "firebase/app";
	import { goto } from '$app/navigation';
	import { getAnalytics } from "firebase/analytics";
	import 'firebase/auth';
	import { onMount } from "svelte";
	import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
	import { getFirestore, collection, getDoc, getDocs, where, query, Timestamp } from 'firebase/firestore';

	var app: any;

	var posts: any[] = [];

	onMount(async () => {
		const firebaseConfig = {
			apiKey: "AIzaSyChIG9JVOAY-ayR0zylRfARKbycrHCVmkk",
			authDomain: "helpadev.firebaseapp.com",
			projectId: "helpadev",
			storageBucket: "helpadev.appspot.com",
			messagingSenderId: "164373117763",
			appId: "1:164373117763:web:6f3a45d2e2d89304b5cdf6",
			measurementId: "G-RY0CH1Z9SQ"
		};

		// Initialize Firebase
		app = initializeApp(firebaseConfig);
		const analytics = getAnalytics(app);

		await getRecentQuestions();
	});

	async function getRecentQuestions() {
		const db = getFirestore(app);
		const messagesRef = collection(db, "posts");
		const sevenDaysAgo = Timestamp.fromMillis(Date.now() - 604800000);
		const querySnapshot = await getDocs(query(messagesRef, where("creationDate", ">=", sevenDaysAgo)));

		querySnapshot.forEach(async (doc) => {
			const postData = doc.data();
			postData.uid = doc.id;
			posts = [...posts, postData];
		});
	}
</script>

<svelte:head>
	<title>HelpA.dev</title>
	<meta name="description" content="Everyone needs a little help sometimes" />
</svelte:head>

<section>
	{#each posts as post}
		<Question postId={post.uid} tags={["tags", "yourmom"]} title={post.title}
			description={post.question} author="Libroru" creationDate={new Date(post.creationDate.seconds * 1000).toDateString()}/>
	{/each}
</section>