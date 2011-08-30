(function() {

    Ext.Router.draw(function(map) {
        map.connect(':controller/:action')
        map.connect(':controller/:action/:id')
    })

    Weather.controllers.weather = Ext.regController('weather', {

        listCities: function() {
            var townIDs = ['2018708', '1103816', '1105779', '1099805', '1100661', '1098081', '1100968']
              , data = []
              , i = 0
              , store = Ext.getStore('CitiesStore')

            Weather.viewport.setActiveItem(Ext.getCmp('citiesList'), 'slide')

            function doneLoading() {
                store.loadData(data)

                // Let subscribers know that loading finished
                store.fireEvent('load')
            }

            function getNextTownData() {
                if (i === townIDs.length) {
                    doneLoading()
                    return
                }

                Ext.Ajax.request({
                    url: 'http://weather.yahooapis.com/forecastjson?w=' + townIDs[i],
                    success: function(r, o) {
                        var newData = Ext.decode(r.responseText)
                        newData.id = townIDs[i]
                        data.push(newData)
                        i++
                        getNextTownData()
                    },
                    failure: function() {
                        Ext.Msg.alert('Error', 'Error retrieving town id ' + townIDs[i], Ext.emptyFn);
                    }
                })
            }

            // Notify subscribers that store is busy loading data
            store.fireEvent('beforeload')

            // Start chained loading
            getNextTownData()
        },

        refreshDetails: function() {
        },

        details: function(opts) {

            var data
              , i = 0
              , store = Ext.getStore('CitiesStore')

            Weather.viewport.setActiveItem(Ext.getCmp('details'), 'slide')

            for (; i < store.data.items.length; i++) {
                if (store.data.items[i].data.id == opts.id) {
                    data = store.data.items[i].data
                    break
                }
            }

            Ext.getCmp('detailsToolbar').setTitle(data.location.city)

        }
    })
})()
