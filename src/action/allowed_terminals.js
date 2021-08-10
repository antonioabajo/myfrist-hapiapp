const fs = require('fs')
const chalk = require('chalk')

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

    allowTerminal = (mac, ip) => {
        console.log("Checking access of MAC:" + mac + " IP:" + ip)
        const terminalsAllowed = this.loadTerminalsAllowed();
        const terminalAllowed = terminalsAllowed.find((terminal) => (terminal.mac ===mac && terminal.ip === ip))
        
        if(!terminalAllowed){
            terminalsAllowed.push({
                mac: mac,
                ip: ip
            })
            console.log(terminalsAllowed)
            this.saveTerminalsAllowed(terminalsAllowed)
            return 1;
        }else{
            console.log('No title allowed!!!')
            return 0;
        }
    }

    disallowTermninal = (mac, ip) => {
        console.log("Checking access of MAC:" + mac + " IP:" + ip)
        const terminalsAllowed = this.loadTerminalsAllowed();
        const terminals2keep = terminalsAllowed.filter((terminal) => terminal.mac !== mac && terminal.ip !== ip)

        if(terminalsAllowed.length > terminals2keep.length){
            console.log(chalk.green.inverse("Terminal removed!!"));
            this.saveTerminalsAllowed(terminals2keep)
            return 1
        }else{
            console.log(chalk.red.inverse("Terminal not found!!"));
            return 0
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

    saveTerminalsAllowed = (allowedTerminals) => {
        const dataJSON  = JSON.stringify(allowedTerminals)
        fs.writeFileSync('public/data/terminals_whitelist.json',dataJSON)
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