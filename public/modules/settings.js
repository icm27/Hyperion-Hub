self.__uv$config = {
    prefix: '/uv/service/',
    bare: '',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/modules/handler.js',
    client: '/modules/client.js',
    bundle: '/modules/core.js',
    config: '/modules/settings.js',
    sw: '/modules/worker.js',
};