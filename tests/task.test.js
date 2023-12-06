const {test} = QUnit;

QUnit.module("Task", () => {
    QUnit.module('constructor', () => {
        test("throws an error when parameters are not specified", assert =>{
            assert.throws(() => {
                new Task();
            }, new Error("parameters are required"));
        });

        // id attribute
        test("throws an error when id attribute is not provided", assert =>{
            assert.throws(() => {
                new Task({attribut: ""});
            }, new Error("id should be provided"));
        });

        test("throws an error when id attribute is not string", assert =>{
            assert.throws(() => {
                new Task({id: 12});
            }, new Error("id should be string"));
        });

        // title attribute
        test("throws an error when title attribute is not provided", assert=>{
            assert.throws(()=>{
                new Task({id: "etytdtgytf"});
            }, new Error("title attribute should be provided"));
        })

        test("throws an error when title attribute is not string", assert=>{
            assert.throws(()=>{
                new Task({id: "etytdtgytf", title: 12});
            }, new Error("title attribute should be string"));
        })

        // description attribute
        test("throws an error when description attribute is not provided", assert=>{
            assert.throws(()=>{
                new Task({id: "etytdtgytf", title: "My task title"});
            }, new Error("description attribute should be provided"));
        })
        
        test("throws an error when description attribute is not string", assert=>{
            assert.throws(()=>{
                new Task({id: "etytdtgytf", title: "My task title", description: 2});
            }, new Error("Task description should be string"));
        })

        // status attribute
        test("throws an error when status attribute is not provided", assert=>{
            assert.throws(()=>{
                new Task({id: "etytdtgytf", title: "My task title", description: "Task description"});
            }, new Error("status attribute should be provided"));
        })
        
        test("throws an error when status attribute is not string", assert=>{
            assert.throws(()=>{
                new Task({id: "etytdtgytf", title: "My task title", description: "Task description", status: 2});
            }, new Error("Task status should be string"));
        })

        // priority attribute
        test("update priority to 'normal' by default when it is not specified", assert => {
            const task = new Task({
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
            });
            assert.equal(task.priority, DEFAULT_TASK_PRIORITY, "priority should be 'normal' by default");
        });

        test("throws an error when priority is provided but not valid", assert=>{
            assert.throws(()=>{
                new Task({id: "etytdtgytf", title: "My task title", description: "My task description",  status: "to do", priority: "djd"});
            }, new Error("priority should be high, normal or low"));
        });
        

        // startDate attribute
        test("throws an error when startDate is not in valid format", assert => {
            const props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-13-30"
            };

            assert.throws(()=>{
                new Task(props);
            }, new Error("startDate should be in valid format"));
        });

        test("throws an error when startDate has passed", assert => {
            const props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2013-02-31"
            };
                
            assert.throws(()=>{
                new Task(props);
            }, new Error("This startDate has passed"));
        })

        test("verify setting of startDate when it is valid", assert =>{
            const props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30"
            };

            var task = new Task(props)
            
            assert.deepEqual(task.startDate, initializeHourMinSec(new Date(props.startDate)), "initialize startDate");
        });


        test("update startDate to now date when it is not specified", assert =>{
            const props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high"
            };
            var task = new Task(props);
            assert.deepEqual(task.startDate, initializeHourMinSec(new Date()), "initialize startDate");
        }); 

        // dueDate attribute
        
        // test("throws an error when dueDate attribute is not provided", assert=>{
        //     const props = {
        //         id: "etytdtgytf",
        //         title: "My task title",
        //         description: "Task description",
        //         status: "to do",
        //         priority: "normal",
        //         startDate: "2023-12-30"
        //     };

        //     assert.throws(()=>{
        //         new Task(props);
        //     }, new Error("dueDate attribute should be provided"));
        // });

        test("throws an error when dueDate is not in valid format", assert => {
            const props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-32"
            };

            assert.throws(()=>{
                new Task(props);
            }, new Error("dueDate should be in valid format"));
        });

        test("throws an error when dueDate is before startDate", assert => {
            const props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-28"
            };
                
            assert.throws(()=>{
                new Task(props);
            }, new Error("This dueDate should be after startDate"));
        })

        test("verify setting of dueDate when it is valid", assert =>{
            const props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };
            var task = new Task(props);
            assert.deepEqual(task.dueDate, initializeHourMinSec(new Date(props.dueDate)), "initialize dueDate");
        });


    })

    QUnit.module('get id', () => {
        var props = {
            id: "etytdtgytf",
            title: "My task title",
            description: "Task description",
            status: "to do",
            priority: "high",
            startDate: "2023-12-30",
            dueDate: "2023-12-31"
        };

        test("get task id", assert=>{
            var task = new Task(props);
            assert.equal(task.id, props.id, "get task id");
        });
    })

    QUnit.module('get title', () => {
        test("get task title", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            assert.equal(task.title, props.title, "get task title");
        });
    })


    QUnit.module('get description', () => {
        test("get task description", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            assert.equal(task.description, props.description, "get task description");
        });
    })

    QUnit.module('get status', () => {
        test("get task status", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            assert.equal(task.status, props.status, "get task status");
        });
    });

    QUnit.module('get priority', () => {
        test("get task priority", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            assert.equal(task.priority, props.priority, "get task priority");
        });
    });


    // Tests related to setters
    QUnit.module('set id', () => {
        test("throws an exception when new id is not valid string", assert=>{
           var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            task = new Task(props);
            assert.throws(()=>{
                task.id = 4;
            }, new Error("id should be string"));
        });

        test("set id", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            task.id = "task id";
            assert.equal(task.id, "task id", "set id");
        });
    })


    QUnit.module('set title', () => {
        test("throws an exception when new title is not valid string", assert=>{
           var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            task = new Task(props);
            assert.throws(()=>{
                task.title = 4;
            }, new Error("title attribute should be string"));
        });

        test("set title", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            task.title = "task title";
            assert.equal(task.title, "task title", "set title");
        });
    })

    QUnit.module('set description', () => {
        test("throws an exception when new description is not valid string", assert=>{
           var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            task = new Task(props);
            assert.throws(()=>{
                task.description = 4;
            }, new Error("Task description should be string"));
        });

        test("set description", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            task.description = "task description";
            assert.equal(task.description, "task description", "set description");
        });
    })

    QUnit.module('set status', () => {
        test("throws an exception when new status is not valid string", assert=>{
           var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            task = new Task(props);
            assert.throws(()=>{
                task.status = 4;
            }, new Error("Task status should be string"));
        });

        test("set status", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            task.title = "task status";
            assert.equal(task.title, "task status", "set status");
        });
    })

    QUnit.module('set priority', () => {
        test("throws an exception when new priority is not string", assert=>{
            var props = {
                 id: "etytdtgytf",
                 title: "My task title",
                 description: "Task description",
                 status: "to do",
                 priority: "high",
                 startDate: "2023-12-30",
                 dueDate: "2023-12-31"
             };
 
             task = new Task(props);
             assert.throws(()=>{
                 task.priority = 4;
             }, new Error("Task priority should be string"));
         });

         test("throws an error when new priority is provided but not valid", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);
            assert.throws(()=>{
                task.priority = "priority";
            }, new Error("priority should be high, normal or low"));
        });

        test("set status", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);

            task.priority = "low";
    
            assert.equal(task.priority, "low", "set priority");
        });
    })


    QUnit.module('set startDate', () => {

        test("throws an error when new startDate is not in valid format", assert => {
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);

            assert.throws(()=>{
                task.startDate = "2023-12-32";
            }, new Error("startDate should be in valid format"));
        });

        test("throws an error when new startDate has passed", assert => {
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };
        
            var task = new Task(props);
            assert.throws(() => {
                task.startDate = "2023-11-20";
            }, new Error("This startDate has passed"));
        });
    
        test("set startDate", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };
        
            var task = new Task(props);
            task.startDate = "2023-12-29";
    
            assert.deepEqual(task.startDate, initializeHourMinSec(new Date("2023-12-29")), "set startDate");
        });
    })


    QUnit.module('set dueDate', () => {

        test("throws an error when new dueDate is not in valid format", assert => {
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };

            var task = new Task(props);

            assert.throws(()=>{
                task.dueDate = "2023-12-32";
            }, new Error("dueDate should be in valid format"));
        });

        test("throws an error when new dueDate is before startDate", assert => {
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };
        
            var task = new Task(props);
            assert.throws(() => {
                task.dueDate = "2023-12-29";
            }, new Error("This dueDate should be after startDate"));
        });
    
        test("set dueDate", assert=>{
            var props = {
                id: "etytdtgytf",
                title: "My task title",
                description: "Task description",
                status: "to do",
                priority: "high",
                startDate: "2023-12-30",
                dueDate: "2023-12-31"
            };
        
            var task = new Task(props);
            task.dueDate = "2024-01-01";
    
            assert.deepEqual(task.dueDate, initializeHourMinSec(new Date("2024-01-01")), "set dueDate");
        });
    })
})