<script>
    import googleLogo from '$lib/images/google_logo.png'
</script>

<section class="d-flex flex-col">
    <div class="card px-4 py-5">
        <form>
            <div class="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
                <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div class="form-group my-3">
                <label for="exampleInputPassword1">Password</label>
                <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
            </div>
            <button type="submit" class="btn btn-primary w-100">Submit</button>
        </form>
        <button class="btn btn-light border-black w-100 mt-4 d-flex-inline flex-row">
            <img src={googleLogo} alt="Google Logo" class="mx-1" style="width: 1.5rem;"/>
            Sign in with Google
        </button>
    </div>
</section>
