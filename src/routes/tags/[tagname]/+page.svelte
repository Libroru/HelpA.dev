<script lang="ts">
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { initializeApp } from "firebase/app";
    import { getFirestore, doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
    
    import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '$lib/api_keys.json';

    const tagname = $page.params.tagname;

    let app;

    const firebaseConfig = {
			apiKey: apiKey,
			authDomain: authDomain,
			projectId: projectId,
			storageBucket: storageBucket,
			messagingSenderId: messagingSenderId,
			appId: appId,
			measurementId: measurementId
    };

    onMount(async () => {
        app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
    });
</script>

<section>
    <span>{tagname}</span>
</section>