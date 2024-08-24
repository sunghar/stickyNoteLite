class TaskExecutor {
    constructor() {
    }

    addIntervalTask(func, intervalTime) {
        setInterval(func, intervalTime);
        return this;
    }

    addInitializingTask(f) {
        f();
        return this;
    }
}

class Tasks {
    static a = 1
    static updataDataToCache() {
        if (currentDataStatus == DataUpdateStatus.UPDATED) {
            storeDataToCache();
            currentDataStatus = DataUpdateStatus.NO_UPDATED;
        }
    }
    static updataDataFromCache() {
        console.log("run updataDataFromCache")
        restoreDataFromCache();
    }
}
