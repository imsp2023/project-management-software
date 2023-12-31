const {test} = QUnit;

QUnit.module("Task", () => {
    QUnit.module('constructor', () => {
        test("throws an error when parameters are not specified", assert =>{
            assert.throws(() => {
                new Task();
            }, new Error(MISSING_PARAMETERS));
        });

        test("with undefined id, _uuid.generate should be called", assert =>{
            let spy = sinon.spy(_uuid, 'generate');

            let task = new Task({title: ".."});
      
            assert.true(spy.calledOnce);
            spy.restore();
        });

        test("with an empty string as id, _uuid.generate should be called", (assert) => {
            let spy = sinon.spy(_uuid, 'generate');
      
            let task = new Task({id: "", title: "...."});
      
            assert.true(spy.calledOnce);
            spy.restore();
        });

        test("throws an error when title attribute is not provided", assert=>{
            assert.throws(()=>{
                new Task({id:""});
            }, new Error(MISSING_PARAMETERS));
        });

        test("with title attribute specified, title setter should be called", assert=>{
            let count = 0;
            sinon.stub(Task.prototype, "title").set(function setterFn() {
              count = 1;
            });

            var t = new Task({title: 'title'});

            assert.equal(count, 1);
            sinon.restore();
        });

        test("with description attribute specified, description setter should be called", assert => {
            let count = 0;
            sinon.stub(Task.prototype, "description").set(function setterFn() {
              count = 1;
            });

            var t = new Task({title: 'title', description: 'description'});

            assert.equal(count, 1);
            sinon.restore();
        });

        test("with priority attribute specified, priority setter should be called", assert => {
            let count = 0;
            sinon.stub(Task.prototype, "priority").set(function setterFn() {
              count = 1;
            });

            var t = new Task({title: 'title', priority: 1});

            assert.equal(count, 1);
            sinon.restore();
        });

        test("with status attribute specified, status setter should  be called", assert =>{
            let count = 0;
            sinon.stub(Task.prototype, "status").set(function setterFn() {
              count = 1;
            });

            var t = new Task({title: 'title', status: 'active'});

            assert.equal(count, 1);
            sinon.restore();
        });

        test("with startDate attribute specified, startDate setter should be called", assert =>{
            let count = 0;
            sinon.stub(Task.prototype, "startDate").set(function setterFn() {
              count = 1;
            });

            var t = new Task({title: 'title',startDate: '22-10-2022'});

            assert.equal(count, 1);
            sinon.restore();
        });

        test(" with dueDate attribute specified, endDate setter should be called", assert =>{
            let count = 0;
            sinon.stub(Task.prototype, "dueDate").set(function setterFn() {
              count = 1;
            });

            var t = new Task({title: 'title', dueDate: '22-10-2023'});

            assert.equal(count, 1);
            sinon.restore();
        });

        test("with parentId attribute specified, parentId setter should be called", assert =>{
            let count = 0;
            sinon.stub(Task.prototype, "parent").set(function setterFn() {
              count = 1;
            });

            var t = new Task({title: 'title', parentId: '125'});

            assert.equal(count, 1);
            sinon.restore();
        });

        // test fails with null, "", undefined as dependences value
        test("throws an exception when dependencies attribute is not an array", assert=>{
            assert.throws(()=>{
                new Task({title: 'title', dependences: "eeee"});
            }, INVALID_TYPE_PARAMETER);
        });

        test("with dependencies attribute specified, dependsOn should be called", assert=>{
            let count = 0;
            sinon.stub(Task.prototype, "dependsOn").callsFake(function fakeFn() {
              count++;
            });      
            let props = {
                title: 'title', 
                dependences: [
                    {id: 'dedede', type: 'DD'}, 
                    {id: 'dedede', type: 'DD'}, 
                    {id: 'dedede', type: 'DD'}
                ]
            };
            let t = new Task(props);

            assert.equal(count, props.dependences.length);
            sinon.restore();
        });

        test("with dependencies attribute specified and offsetDay too, addOffsetDayOnDependence should be called", assert=>{
            let count = 0;
            sinon.stub(Task.prototype, "addOffsetDayOnDependence").callsFake(function fakeFn() {
              count++;
            });      
            let props = {
                title: 'title', 
                dependences: [
                    {id: 'dedede', type: 'DD'}, 
                    {id: 'dedede', type: 'DD'}, 
                    {id: 'dedede', type: 'DD'}
                ]
            };
            let t = new Task(props);

            assert.equal(count, props.dependences.length);
            sinon.restore();
        });

        test("with responsible attribute specified, responsible setter should be called", assert=>{
            let count = 0;
            sinon.stub(Task.prototype, "responsible").set(function fakeFn() {
              count++;
            });

            let props = {title: 'title', responsible: 'franck'};
            let t = new Task(props);

            assert.equal(count, 1);
            sinon.restore();
        });
    });

    QUnit.module('parent setter', () => {
        test("throws an exception when no parameter is specified", (assert) => {
            let task = new Task({title: "title"});
  
            assert.throws(() => {
              task.parent = undefined;
            }, new Error(MISSING_PARAMETERS));
       });

       test("with parentId specified, getTask should be called from Register", assert=>{
            let count = 0;
            sinon.stub(Register, "getTask").callsFake(function fakeFn() {
                count++;
                return {};
            });
            let task = new Task({title: "title"});
            task.parent = 'ygytgvyvgyt';

            assert.equal(count, 1);
            sinon.restore();
       });

       test("with an unexisting task as parent, an exception should be thrown", assert=>{
            sinon.stub(Register, "getTask").callsFake(function fakeFn() {
                return null;
            });
            let task = new Task({title: "title", startDate: '22-10-2023'});

            assert.throws(()=>{
                task.parent = 'ygytgvyvgyt';
            }, INEXISTANT_TASK);
            sinon.restore();
       });

       test("with an existing task as parent and wrong child' startDate, startDate setter should be called", assert=>{
            let count = 0;    
            sinon.stub(Register, "getTask").callsFake(function fakeFn() {
                return {
                    startDate: new Date(2023, 9, 20)
                };
            });
            sinon.stub(Task.prototype, "startDate").set(function fakeFn() {
               count++;
            });
            let task = new Task({title: "title"});
            task._startDate = new Date(2023, 8, 10);
            
            task.parent = 'ygytgvyvgyt';

            assert.equal(count, 1);
            sinon.restore();
       });

       test("with an existing task as parent and right child' startDate, startDate setter should not be called", assert=>{
            let count = 0;    
            sinon.stub(Register, "getTask").callsFake(function fakeFn() {
                return {
                    startDate: new Date(2023, 9, 20)
                };
            });
            sinon.stub(Task.prototype, "startDate").set(function fakeFn() {
            count++;
            });
            let task = new Task({title: "title"});
            task._startDate = new Date(2023, 10, 10);
            
            task.parent = 'ygytgvyvgyt';

            assert.equal(count, 0);
            sinon.restore();
        });

        test("with an existing task as parent and wrong child' dueDate, dueDate setter should be called", assert=>{
            let count = 0;    
            sinon.stub(Register, "getTask").callsFake(function fakeFn() {
                return {
                    startDate: new Date(2023, 9, 20),
                    dueDate: new Date(2023, 11, 20)
                };
            });
            sinon.stub(Task.prototype, "dueDate").set(function fakeFn() {
               count++;
            });
            let task = new Task({title: "title"});
            task._startDate = new Date(2023, 10, 10);
            task._dueDate = new Date(2024, 10, 10);
            
            task.parent = 'ygytgvyvgyt';

            assert.equal(count, 1);
            sinon.restore();
       });

       test("with an existing task as parent and right child' dueDate, dueDate setter should not be called", assert=>{
            let count = 0;    
            sinon.stub(Register, "getTask").callsFake(function fakeFn() {
                return {
                    startDate: new Date(2023, 9, 20),
                    dueDate: new Date(2023, 11, 20)
                };
            });
            sinon.stub(Task.prototype, "dueDate").set(function fakeFn() {
            count++;
            });
            let task = new Task({title: "title"});
            task._startDate = new Date(2023, 10, 10);
            task._dueDate = new Date(2023, 10, 20);
            
            task.parent = 'ygytgvyvgyt';

            assert.equal(count, 0);
            sinon.restore();
        });
        // check that task.dueDate > parentTask.startDate and task.startDate < parentTask.dueDate
    });

    QUnit.module('title setter', () => {
        test("throws an error when title attribute is not provided", assert=>{
            let task = new Task({title: "title"});

            assert.throws(()=>{
                task.title = undefined;
            }, new Error(MISSING_PARAMETERS));
        });

        test("throws an error when title attribute is not a string", assert=>{
            let task = new Task({title: "title"});

            assert.throws(()=>{
                task.title = 123;
            }, new Error(INVALID_TYPE_PARAMETER));
        });

        test("with valid title, title should be saved properly", assert=>{
            let task = new Task({title: "title"});

            task.title = 'iwe title';

            assert.equal(task.title, 'iwe title');
        });
    })

    QUnit.module('description setter', () => {
        test("throws an error when description parameter isn't specified", (assert) => {
            let t = new Task({ title: "iwe title" });
            assert.throws(() => {
              t.description = undefined;
            }, new Error(MISSING_PARAMETERS));
        });
      
        test("throws an error when description parameter is not a string", (assert) => {
            let t = new Task({ title: "iwe title" });
            assert.throws(() => {
                t.description = 2;
            }, new Error(INVALID_TYPE_PARAMETER));
        });
    
        test("valid description should be saved properly", (assert) => {
            let t = new Task({ title: "iwe title"});
            t.description  = "iwe description";
            assert.equal(t.description, 'iwe description');
        });
    });

    QUnit.module('status setter', () => {
        test("throws an error when status parameter is not a string", (assert) => {
            let t = new Task({ title: "iwe title" });
      
            assert.throws(() => {
              t.status = 2;
            }, new Error(INVALID_TYPE_PARAMETER));
        });
      
      
        test("valid status should be saved properly", (assert) => {
            let t = new Task({ title: "iwe title" });
            assert.equal(t.status, undefined);
            sinon.stub(Task.prototype, "status").get(function setterFn() {
                return "active";
            });
        
            t.status = "active";
            
            assert.equal(t.status, 'active');
            sinon.restore();
        });
    });

    QUnit.module('priority setter', () => {
        test("throws an exception when priority is not a number", assert=>{
            let t = new Task({ title: "iwe title" });
      
            assert.throws(() => {
              t.priority = '2';
            }, new Error(INVALID_TYPE_PARAMETER));
        });

        test("with valid type priority, priority should be saved properly", assert=>{
            let t = new Task({ title: "iwe title" });
            assert.equal(t.status, undefined);
            sinon.stub(Task.prototype, "priority").get(function setterFn() {
                return 2;
            });
        
            t.priority = 2;
            
            assert.equal(t.priority, 2);
            sinon.restore();
        });
    });

    QUnit.module("startDate setter", () => {
        test("throws an error when startDate is invalid", (assert) => {
          let t = new Task({ title: "title" });
          var stub = sinon.stub(regex, 'test').callsFake(function fn(){
            return false;
          });
          assert.throws(()=>{
            t.startDate = "22-13-2022";
          }, INVALID_DATE_FORMAT);
          sinon.restore();
        });
    
        test("with valid startDate, startDate should be saved properly", (assert) => {
            let t = new Task({ title: "title" });
            var stub = sinon.stub(regex, 'test').callsFake(function fn(){
                return true;
            });
    
          t.startDate = "22-12-2022";
          assert.deepEqual(t.startDate, new Date(2022, 11, 22));
          sinon.restore();
        });
    });

    QUnit.module("set dueDate", () => {
        test("throws an error when dueDate is invalid", (assert)=> {
            let t = new Task({ title: "title" });
            var stub = sinon.stub(regex, 'test').callsFake(function fn(){
                return false;
            });
            assert.throws(()=>{
                t.dueDate = "22-13-2022";
            }, INVALID_DATE_FORMAT);
            sinon.restore();
        });
    
        test("with valid dueDate, endDate should be saved properly", (assert) => {
            let t = new Task({ title: "title" });
            var stub = sinon.stub(regex, 'test').callsFake(function fn(){
                return true;
            });
        
            t.dueDate = "22-10-2022"
            assert.deepEqual(t.dueDate, new Date(2022, 9, 22));
            sinon.restore();
        });
    });

    QUnit.module("set responsible", ()=>{
        test("isMemberExist should be called from Register", (assert) => {
            let t = new Task({ title: "title" });
            let count = 0;
            sinon.stub(Register, "isMemberExist").callsFake(function fakeFn() {
                count++;
                return true;
            });

            t.responsible = 'duamelo';

            assert.equal(count, 1);
            sinon.restore();
        });

        test("with an existing member specified, responsible attribute should be updated", (assert) => {
            let t = new Task({ title: "title" });
            var stub = sinon.stub(Register, 'isMemberExist').callsFake(function fn(){
                return true;
            });
            t.responsible = 'duamelo';
            assert.equal(t._responsible, 'duamelo');
            sinon.restore();
        });

        test("with a member that's not enregistred, throws an exception", (assert) => {
            let t = new Task({ title: "title" });
            var stub = sinon.stub(Register, 'isMemberExist').callsFake(function fn(){
                return false;
            });
            assert.throws(()=>{
                t.responsible = 'duamelo';
            }, INEXISTING_MEMBER);
            sinon.restore();
        });
    });

QUnit.module("dependsOn", () => {
        test("throws an exception when no parameters is provided", (assert) => {
            let tk = new Task({ title: "bhebhgr" });
            assert.throws(() => {
                tk.dependsOn();
            }, new Error(MISSING_PARAMETERS));
        });
    
        test("with taskId parameter specified, getTask from register should be called once", (assert) => {
            let count = 0;
            sinon.stub(Register, "getTask").callsFake(function fn() {
                count = 1;
                return {
                    id: '456',
                    startDate: (function(){
                        return new Date("2020-11-1");
                    })()
                };
            });
            let tk = new Task({ id: "14595", title: "dbhr" });

            tk.dependsOn("456");
            
            assert.equal(count, 1);
            sinon.restore();
        });
    
        test("throws an error when the task doesn't exist in register", (assert) => {
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return null;
            });
            let tk = new Task({ title: "bhebhgr" });

            assert.throws(() => {
            tk.dependsOn("1");
            }, new Error(INEXISTANT_TASK));
            sinon.restore();
        });
    
        test("with taskId specified, hasCyclicDependence should be called", (assert) => {
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: "111",
                    startDate: (function(){
                        return new Date("2021-3-11");
                    })()
                };
            });
            let count = 0;
            sinon.stub(Task.prototype, "hasCyclicDependence").callsFake(function fn() {
                count++;
            });
            let task = new Task({ id: "11", title: "dsbfh" });

            task.dependsOn('111');

            assert.equal(count, 1);
            sinon.restore();
        });

        test("with cyclic dependence, an exception should be thrown", (assert) => {
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: "11",
                    startDate: (function(){
                        return new Date("2021-3-11");
                    })()
                };
            });
            sinon.stub(Task.prototype, "hasCyclicDependence").callsFake(function fn() {
                return true;
            });
            let task = new Task({ id: "11", title: "dsbfh" });

            assert.throws(() => {
                task.dependsOn("11");
            }, new Error(CYCLIC_DEPENDENCE_NOT_ALLOWED));
            sinon.restore();
        });

        test("throws an exception when the dependence parameter is neither FF nor DD nor FD", (assert) => {
            let tk = new Task({id: '25493', title: "bhebhgr" });
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: '11',
                    startDate: (function(){
                        return new Date(2020, 11, 1);
                    })()
                };
            });
            assert.throws(() => {
                tk.dependsOn("11", "ls");
            }, new Error(INVALID_DEPENDENCE));
            sinon.restore();
        });
        
        test("set DD dependence by default when the dependence parameter isn't specified", (assert) => {
            let task = new Task({id: "1495", title: "bhebhgr", startDate: '1-11-2020' });
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: "12",
                    startDate: (function(){
                        return new Date(2020, 2, 1);
                    })()
                };
            });
            task.dependences = {};

            task.dependsOn("12");

            assert.equal(task.dependences['12'], 'DD');
            sinon.restore();
        });
    
        test("with invalid startDate when I apply DD dependency, startDate should be updated", (assert) => {
            let task = new Task({
                id:'1496',
                title: "bhebhgr1",
                startDate: '1-3-2019'
            });
            let date = new Date(2020, 11, 1);
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: "12",
                    startDate: (function(){
                        return date;
                    })()
                };
            });
            task.dependsOn("12");
            
            assert.true(task.startDate >= date);
            sinon.restore();
        });

        test("with valid startDate when I apply DD dependency, startDate should not be changed", (assert) => {
            let task = new Task({
                id:'1496',
                title: "bhebhgr1",
                startDate: '1-12-2020'
            });
            let date = new Date(2020, 11, 1);
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: "12",
                    startDate: (function(){
                        return date;
                    })()
                };
            });
            task.dependsOn("12");
            
            assert.true(task.startDate >= date);
            sinon.restore();
        });
    

        test("with invalid dueDate when I apply FF dependency, dueDate should be updated", (assert) => {
            let task = new Task({id:'1463', title: "bhebhgr1", dueDate: '25-1-2026' });
            let date = new Date(2026, 0, 30);
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: "5",
                    dueDate: (function(){
                        return date;
                    })()
                };
            });

            task.dependsOn("5", "FF");
            
            assert.true(task.dueDate >= date);
            sinon.restore();
        });

        test("with valid dueDate when I apply FF dependency, dueDate should be updated", (assert) => {
            let task = new Task({id:'1463', title: "bhebhgr1", dueDate: '1-2-2026' });
            let date = new Date(2026, 0, 30);
            sinon.stub(Register, "getTask").callsFake(function fn() {
                return {
                    id: "5",
                    dueDate: (function(){
                        return date;
                    })()
                };
            });

            task.dependsOn("5", "FF");
            
            assert.true(task.dueDate >= date);
            sinon.restore();
        });
    
        test("with invalid startDate when I apply FD dependency, startDate should be updated", (assert) => {
          let task = new Task({
            title: "bhebhgr1",
            startDate: '25-1-2026',
          });
          let date = new Date(2026, 0, 30);
          sinon.stub(Register, "getTask").callsFake(function fn() {
            return {
              id: "5",
              dueDate: (function(){
                return date;
              })()
            };
          });

          task.dependsOn("5", "FD");

          assert.true(task.startDate >= date);
          sinon.restore();
        });
    
        test("with valid startDate when I apply FD dependency, startDate should be updated", (assert) => {
            let task = new Task({
              title: "bhebhgr1",
              startDate: '30-1-2026',
            });
            let date = new Date(2026, 0, 30);
            sinon.stub(Register, "getTask").callsFake(function fn() {
              return {
                id: "5",
                dueDate: (function(){
                  return date;
                })()
              };
            });
  
            task.dependsOn("5", "FD");
  
            assert.true(task.startDate >= date);
            sinon.restore();
          });
      
        test("only one type dependence is allowed between two tasks", (assert) => {
          let task = new Task({id: '14635', title: "bhebhgr", startDate: '3-2-2025'});
          let stub = sinon.stub(Register, "getTask").callsFake(function fn() {
            return {
                id: "14",
                startDate: (function(){
                    return new Date(2025, 1, 3);
                })()
            };
          });
          task.dependences = {};

          task.dependsOn("14", "DD");
          task.dependsOn("14", "DD");

          assert.true(Object.keys(task.dependences).length == 1);
          stub.restore();
        });
    });
});
