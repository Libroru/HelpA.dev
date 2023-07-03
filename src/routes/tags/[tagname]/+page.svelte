<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
    
    const tagname = $page.params.tagname;

    let app;

    const firebaseConfig = {
			apiKey: "AIzaSyChIG9JVOAY-ayR0zylRfARKbycrHCVmkk",
			authDomain: "helpadev.firebaseapp.com",
			projectId: "helpadev",
			storageBucket: "helpadev.appspot.com",
			messagingSenderId: "164373117763",
			appId: "1:164373117763:web:6f3a45d2e2d89304b5cdf6",
			measurementId: "G-RY0CH1Z9SQ"
    };

    onMount(async () => {
        app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
    });
</script>

<section>
    <span>{tagname}</span>
</section>