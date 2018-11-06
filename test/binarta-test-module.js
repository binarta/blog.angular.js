(function () {
    angular.module('binarta-alljs-tpls-angular1', []);
    angular.module('binarta-publisherjs-tpls-angular1', []);
    angular.module('binarta-checkpointjs-gateways-angular1', ['binarta-checkpointjs-inmem-angular1'])
        .provider('binartaCheckpointGateway', ['inmemBinartaCheckpointGatewayProvider', proxy]);

    angular.module('binarta-applicationjs-gateways-angular1', ['binarta-applicationjs-inmem-angular1'])
        .provider('binartaApplicationGateway', ['inmemBinartaApplicationGatewayProvider', proxy]);

    angular.module('binarta-publisherjs-gateways-angular1', ['binarta-publisherjs-inmem-angular1'])
        .provider('binartaPublisherGateway', ['inmemBinartaPublisherGatewayProvider', proxy]);

    function proxy(gateway) {
        return gateway;
    }
})();