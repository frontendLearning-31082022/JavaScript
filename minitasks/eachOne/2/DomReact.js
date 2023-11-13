class DomReact {
    /** vars from args not storing */
    constructor(data, templateMap) {
        this.reactVars = new Map();

        this.recurEnter(data, templateMap);
    }

    recurEnter(object, templateMap) {
        let value;
        // let fields= Object.entries(object).filter(x=>{
        //     debugger;
        //   })
        // debugger;
        // // this.createDomVar(k, object[k], object, templateMap);
        Object.keys(object).some((k) => {
            this.createDomVar(k, object[k], object, templateMap);
            // console.log(`key ${k} value ${object[k]}`);
            if (object[k] && typeof object[k] === 'object') {
                value = this.recurEnter(object[k], templateMap);
                return value !== undefined;
            }
        });
        return value;
    }

    createDomVar(name, val, wholeObj, templateMap) {
        if (!templateMap.has(name)) return;

        let arr = this.reactVars.get('name');
        if (!arr) arr = new Array();

        let idDataDomV = arr.length != 0 ? arr.length - 1 : 0;

        arr.push(new DomVar(name, templateMap.get(name).parentNode, val, idDataDomV));

        let b = 0;
    }
}
class DomVar {
    constructor(nameVar, parentClassNode, val, idDataDomV) {
        this.nameVar = nameVar;
        this.parentClassNode = parentClassNode;
        this.val = val;
        this.idDataDomV = `dataDomV${idDataDomV}`;
        // this.renderId = renderId;

        this.initDomStruct();
    }

    initDomStruct() {
        debugger;
        const parent = document.getElementsByClassName(this.parentClassNode)[0];
        const div = document.createElement("div");
        div.textContent = this.val;
        parent.appendChild(div);
    }

    setVal(val) {
        this.val = val;
        document.getElementById(`dataDomV${this.id}`).textContent = val;
    }
}