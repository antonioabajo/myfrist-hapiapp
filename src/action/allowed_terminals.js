const fs = require('fs')

class AllowedTerminalsPriv {
    constructor() {
       console.log("Instance of AllowedTerminalsPriv")
    }

    isTerminalAllowed = (mac, ip) => {
        console.log("Checking access of MAC:" + mac + " IP:" + ip)
        const terminalsAllowed = this.loadTerminalsAllowed();
        const terminalAllowed = terminalsAllowed.find((terminal) => (terminal.mac ===mac && terminal.ip === ip))
        if(terminalAllowed){
            return 1;
        }else{
            return 0;
        }
    }

    loadTerminalsAllowed = () => {
        try{
            const dataBuffer = fs.readFileSync('public/data/terminals_whitelist.json')
            const dataJSON = dataBuffer.toString()
            return JSON.parse(dataJSON);
        }catch (e){
            return []
        }
    }
}

class AllowedTerminals {

    constructor() {
        throw new Error('Use Singleton.getInstance()');
    }

    static getInstance() {
        if (!AllowedTerminals.instance) {
            AllowedTerminals.instance = new AllowedTerminalsPriv();
        }
        return AllowedTerminals.instance;
    }   
    
}

module.exports = AllowedTerminals;