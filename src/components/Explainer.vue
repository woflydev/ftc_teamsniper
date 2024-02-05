<template>
<div class="container mt-4">
    <h2>FAQ</h2>
    <div class="accordion" id="explainerAccordion">
    <div class="accordion-item">
        <h3 class="accordion-header" id="step1">
        <button
            class="accordion-button"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseStep1"
            aria-expanded="true"
            aria-controls="collapseStep1"
        >
            What's this for?
        </button>
        </h3>
        <div
        id="collapseStep1"
        class="accordion-collapse collapse show"
        aria-labelledby="step1"
        data-bs-parent="#explainerAccordion"
        >
        <div class="accordion-body">
            I dunno. We just wanted to get a good team number. Here's a link to my
            <a
                href="https://woflydev.com" 
                rel="noreferrer noopener"
                target="_blank">
                website</a>.

        </div>
        </div>
    </div>
    <div class="accordion-item">
        <h3 class="accordion-header" id="step2">
        <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseStep2"
            aria-expanded="false"
            aria-controls="collapseStep2"
        >
            Is this project open source?
        </button>
        </h3>
        <div
        id="collapseStep2"
        class="accordion-collapse collapse"
        aria-labelledby="step2"
        data-bs-parent="#explainerAccordion"
        >
        <div class="accordion-body">
            Yep! The code that runs this website is available for anyone to see and use.
            The code is available on <a href="https://github.com/woflydev/ftc-teamsniper" rel="noreferrer noopener" target="_blank">GitHub</a>.
            TeamSniper is licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" rel="noreferrer noopener" target="_blank">GNU GPLv3</a> license.
        </div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
export default {

};
</script>

<style scoped>
/* Add any custom CSS styles here if needed */

</style>
