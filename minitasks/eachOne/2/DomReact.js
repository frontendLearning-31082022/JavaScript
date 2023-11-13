class DomReact {
    /** vars from args not storing */
    constructor(data, parentNode, enableVIDs) {
        this.reactVars = new Map();
        this.enableVIDs = enableVIDs;
        // this.templateMap;
        this.genRV = function () {
            let id = 0;
            function get() {
                id++;
                return "idV" + id;
            }
            return get;
        }();
        this.genGlobal = function () {
            let id = 100;
            function get() {
                id++;
                return "idV" + id;
            }
            return get;
        }();


        this.root = new DomVar([], 'root', null)
        this.root.dom = parentNode;
        this.recurEnter(data, null, this.root);

        debugger;
    }

    recurEnter(object, name, parNode) {
        let value;

        // this.createDomVar(k, object[k], object, templateMap);
        const domVar = this.createDomVar(object, name, parNode);
        Object.keys(object).some((key) => {
            // this.createDomVar(k, object[k], object, templateMap);
            // console.log(`key ${k} value ${object[k]}`);
            if (object[key] && typeof object[key] === 'object') {
                value = this.recurEnter(object[key], key, domVar);
                return value !== undefined;
            }
        });
        return value;
    }

    createDomVar(object, name, parNode) {

        let fields = Object.entries(object).filter(x => {
            // if (typeof x[1][Symbol.iterator] === 'function') return false;
            if (x[1] !== Object(x[1])) return true;
            return false;
        }
        );


        // if (!templateMap.has(name)) return;

        // let arr = this.reactVars.get('name');
        // if (!arr) arr = new Array();

        // debugger;

        // let fields=Object.entries(object);

        // let domVar = new DomVar(name, this.templateMap.get(name).parentNode, val, this.genRV.get());
        debugger;
        const domVar = new DomVar(fields, name, parNode, this.enableVIDs ? this.genRV() : undefined);
        this.reactVars.set(domVar.vRD_id, domVar);
        // arr.push(domVar);

        return domVar;
    }

    getVar(vRD_id) {
        return this.reactVars.get(vRD_id);
    }
    addVar(fields, parentDomVar) {
        debugger;
        // let fields = new Map();
        // fields.set("text", text);

        // m.s
        // let fields=Array.from(map, ([name, value]) => ({ name, value }));


        const domVar = new DomVar(fields, name, parentDomVar, this.enableVIDs ? this.genRV() : undefined);
        this.reactVars.set(domVar.vRD_id, domVar);
    }



}
class DomVar {
    constructor(fields, name, parNode, vRD_id) {
        this.children = [];

        this.vRD_id = vRD_id;

        this.name = name;
        if (this.name) {
            if (this.name.match("^\\d*$")) {
                this.name = undefined;
                this.index = name;
            }
        }

        this.parNode = parNode;

        this.fields = new Map(fields);

        this.id = this.fields.get('id');
        this.fields.delete('id');

        if (this.fields.has('vRDelement')) {
            this.vRDelement = this.fields.get('vRDelement');
            this.fields.delete('vRDelement');
        }
        if (this.fields.has('onclick')) {
            this.onclick = this.fields.get('onclick');
            this.fields.delete('onclick');
        }

        this.textContent = Array.from(this.fields, ([name, value]) => ({ name, value })).map(x => x.value).join(' ');
        // debugger;  
        // this.textContent=this.fields.entries.  

        if (this.name !== 'root') this.parNode.children.push(this);

        this.initDomStruct();

        // if (!fields) return;
        // debugger;
    }



    initDomStruct() {
        if (this.name === 'root') return;

        let typeDomEl = this.vRDelement ? this.vRDelement : 'div';
        this.dom = document.createElement(typeDomEl);
        this.dom.textContent = this.textContent;

        debugger;
        if (this.vRD_id) this.dom.setAttribute('vRD_id', this.vRD_id);
        if (this.id) this.dom.setAttribute('id', this.id);


        if (this.name) this.dom.classList.add(this.name);
        if (this.onclick) {
            debugger;
            this.dom.setAttribute('onclick', this.onclick);
        }





        let node = this.name !== 'root' ? this.parNode.dom : document.body;
        node.appendChild(this.dom);
        let atB = 0;
    }

    // constructor(nameVar, parentClassNode, val, idDataDomV) {
    //     this.nameVar = nameVar;
    //     this.parentClassNode = parentClassNode;
    //     this.val = val;
    //     this.idDataDomV = `dataDomV${idDataDomV}`;
    //     // this.renderId = renderId;

    //     this.initDomStruct();
    // }

    // initDomStruct() {
    //     debugger;
    //     const parent = document.getElementsByClassName(this.parentClassNode)[0];
    //     const div = document.createElement("div");
    //     div.textContent = this.val;
    //     parent.appendChild(div);
    // }

    setVal(val) {
        this.val = val;
        document.getElementById(`dataDomV${this.id}`).textContent = val;
    }

}