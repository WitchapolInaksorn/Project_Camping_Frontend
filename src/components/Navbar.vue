<template>
    <nav class="navbar navbar-expand-lg nav-transparent fixed-top">
        <div class="container-fluid">

            <a class="navbar-brand text-light" href="#">Navbar</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <div class="nav-links">
                    <ul class="navbar-nav mb-2 mb-lg-0 gap-3">
                        <li class="nav-item">
                            <router-link to="/Homepage" class="text-decoration-none nav-items fw-normal"> Home </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/Login" class="text-decoration-none nav-items fw-normal"> Login </router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/Product" class="text-decoration-none nav-items fw-normal"> Shopping </router-link>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar'
}
</script>

<style>
.nav-transparent {
    top: 0;
    left: 0;
    width: 100%;
    background: rgba(0, 0, 0, 0.3); 
    backdrop-filter: blur(10px); 
    padding: 10px 20px;
}

.nav-items {
    color: white;
    text-decoration: none;
    padding: 5px 10px;
    position: relative;
    transition: color 0.3s ease-in-out;
}

.nav-items:hover {
    color: #ffc107; 
}

.nav-items::after {
    content: ''; 
    position: absolute;
    left: 0;
    bottom: -2px;
    width: 100%;
    height: 2px;
    background-color: #ffc107;
    transform: scaleX(0);
    transition: transform 0.3s ease-in-out;
}

.nav-items:hover::after {
    transform: scaleX(1);
}

.nav-links {
    display: flex;
    justify-content: flex-end; 
    width: 100%;
}

@media (max-width: 991px) {
    .nav-links {
        justify-content: flex-start; 
    }
}
</style>
