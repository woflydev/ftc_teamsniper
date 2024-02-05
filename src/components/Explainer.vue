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
            What the hell Is ZeroTrip?
        </button>
        </h3>
        <div
        id="collapseStep1"
        class="accordion-collapse collapse show"
        aria-labelledby="step1"
        data-bs-parent="#explainerAccordion"
        >
        <div class="accordion-body">
            The name might seem familiar. That's probably for a reason.
            ZeroTrip is a search engine for public transport stations, stops, and other live data,
            because I am sick of staring at the barely functional mess that is the official TransLink Journey Planner.
            ZeroTrip intends to be an alternative (and open source) privacy-focused frontend 
            to the popular public transport tracker 
            <a
                href="https://anytrip.com.au" 
                rel="noreferrer noopener"
                target="_blank">
            AnyTrip</a>.

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
            What does "Open Source" mean?
        </button>
        </h3>
        <div
        id="collapseStep2"
        class="accordion-collapse collapse"
        aria-labelledby="step2"
        data-bs-parent="#explainerAccordion"
        >
        <div class="accordion-body">
            Open Source means that the code that runs this website is available for anyone to see and use.
            Anyone can contribute to the project, and anyone can use the code to make their own version of ZeroTrip.
            The code is available on <a href="https://github.com/woflydev/zerotrip" rel="noreferrer noopener" target="_blank">GitHub</a>.
            ZeroTrip is licensed under the <a href="https://www.gnu.org/licenses/gpl-3.0.en.html" rel="noreferrer noopener" target="_blank">GNU GPLv3</a> license.
        </div>
        </div>
    </div>

    <div class="accordion-item">
        <h3 class="accordion-header" id="step3">
        <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseStep3"
            aria-expanded="false"
            aria-controls="collapseStep3"
        >
            Well then I can just copy it, right?
        </button>
        </h3>
        <div
        id="collapseStep3"
        class="accordion-collapse collapse"
        aria-labelledby="step3"
        data-bs-parent="#explainerAccordion"
        >
        <div class="accordion-body">
            What's stopping you? Well I'm going to be totally honest: nothing, really. You could
            download the entire codebase from GitHub and change it to suit your needs.
            If you're nice, you could even contribute to the project by opening
            a <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests" rel="noreferrer noopener" target="_blank">pull request</a>
            to make ZeroTrip better for everyone.
            If you do plan on using ZeroTrip's code, please make sure you follow the license. The permissions,
            limitations, and conditions can be found <a href="https://choosealicense.com/licenses/gpl-3.0/" rel="noreferrer noopener" target="_blank">here</a>.
        </div>
        </div>
    </div>

    </div>
</div>
</template>

<script>
export default {
// Add any component-specific logic here if needed
};
</script>

<style scoped>
/* Add any custom CSS styles here if needed */
/*.container {
  width: 100%;
  margin: 0 auto;
  max-width: 100%;
}*/
</style>
