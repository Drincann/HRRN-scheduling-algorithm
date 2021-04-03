
class Job {

    constructor(time) {
        this.timeTotal = time * 1000;
        this.timeLeft = time * 1000;
        this.start = this.createTime = Date.now();
        this.end = Date.now();
        this.running = false;
        this.lastPriority = 0;
    }

    isCanRunning() {
        return this.timeLeft > 0;
    }

    getPriority() {
        if (this.timeLeft <= 0) {
            return 0;
        }
        if (this.running) {
            return this.lastPriority;
        } else {
            return this.lastPriority = (Date.now() - this.end + this.timeTotal) / this.timeTotal;
        }
    }

    active() {
        this.running = true;
        this.start = Date.now();

    }

    stop() {
        this.running = false;
        this.timeLeft -= Date.now() - this.start;
        if (this.timeLeft <= 0) {
            this.timeLeft = 0;
        }
        this.end = Date.now();
    }
}

function max() {

}

(() => {
    const jobs = [
        new Job(10),
        new Job(1),
        new Job(1),
        new Job(2),
        new Job(15),
        new Job(15),
        new Job(5),
    ]


    let currJob = undefined;
    setInterval(() => {
        let checked = false;
        const oldJob = currJob;
        currJob = currJob?.isCanRunning() ? (checked = true, currJob) : undefined;
        jobs.forEach((job) => {
            if (!job.isCanRunning()) {
                return;
            }
            if (!currJob) {
                return currJob = job.isCanRunning() ? (checked = true, job) : undefined;
            }
            currJob = job.getPriority() > currJob.getPriority() ? (checked = true, job) : currJob;
        });
        if (checked) {
            oldJob?.stop();
            currJob.active()
        }
        const jobIndex = jobs.indexOf(currJob);

        console.clear();
        console.log('优先级   : ', jobs.map((v, i) => i == jobIndex ? '\x1B[1m\x1B[31m' + v.getPriority().toFixed(2).toString() + '\x1B[22m\x1B[39m' : v.getPriority().toFixed(2).toString()).join(' '));
        console.log('剩余时间 : ', jobs.map((v, i) => i == jobIndex ? '\x1B[1m\x1B[31m' + v.timeLeft.toString() + '\x1B[22m\x1B[39m' : v.timeLeft.toString()).join(' '));
        if (!jobs.filter(v => v.timeLeft > 0).length) {
            throw 'stop';
        }
    }, 100);
})()