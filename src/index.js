const Bcrypt = require('bcrypt');
const Hapi = require('@hapi/hapi');
const Path = require('path');
const AllowedTerminals = require('./action/allowed_terminals')

const users = {
    john: {
        username: 'john',
        password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
        name: 'John Doe',
        id: '2133d32a'
    }
};

const validate = async (request, username, password) => {

    console.log(request.path)

    const user = users[username];
    if (!user && require.path === '/logout') {
        return { credentials: null, isValid: false };
    }
    

    let isValid = await Bcrypt.compare(password, user.password);
    const credentials = { id: user.id, name: user.name };

    return { isValid, credentials };
};

const start = async () => {

    const publicPath = Path.join(__dirname,'../public')
    console.log(publicPath)

    const port = process.env.PORT || 3000

    const server = Hapi.server({ 
        port ,
        routes: {
            files: {
                relativeTo: publicPath
            }
        }
    });

    await server.register(require('@hapi/basic'));
    await server.register(require('@hapi/inert'));

    server.auth.strategy('simple', 'basic', { validate });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {

            return h.file('index.html');
        }
    });


    server.route({
        method: 'GET',
        path: '/action/{action}/{mac}/{ip}',
        handler: function (request, h) {
            let terminalAllowed = 0
            switch(request.params.action){
                case 'checkmac':
                    let allowedTerminals = AllowedTerminals.getInstance()
                    terminalAllowed = allowedTerminals.isTerminalAllowed(request.params.mac,request.params.ip)
            }
            return terminalAllowed

           
           return "hola caracola " + request.params.action + " " + request.params.mac;
        }
    });

    server.route({
        method: 'GET',
        path: '/auth',
        options: {
            auth: 'simple'
        },
        handler: function (request, h) {

            return 'Now, You are logged';
        }
    });

    server.route({
        method: 'GET',
        path: '/logout',
        options: {
            auth: 'simple'
        },
        handler: function (request, h) {
            return h.response('You are logged out now').code(401)
        }
    });

    server.route({
        method: 'GET',
        path: '/js/{filename}',
        handler: {
            file: function (request) {
                console.log(request.params.filename)
                return 'js/' +request.params.filename;
            }
        }
    });

    await server.start();

    console.log('server running at: ' + server.info.uri);
};

start();