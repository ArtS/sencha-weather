(function() {
    Weather.Viewport = Ext.extend(Ext.Panel, {
        fullscreen: true,
        ui: 'light',
        defaults: {
            iconMask: true,
            cls: 'card card3',
            scroll: true
        },
        layout: 'card',
        activeItem: 0,
        items: [
            {
                xtype: 'panel',
                id: 'citiesList',
                layout: 'fit',
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        title: 'Cities',
                        dock: 'top',
                        defaults: {iconMask: true},
                        items: [
                            {
                                iconCls: 'refresh',
                                handler: Weather.controllers.weather.listCities
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'CitiesList'
                    }
                ]
            },
            {
                xtype: 'panel',
                id: 'details',
                dockedItems: [
                    {
                        xtype: 'toolbar',
                        id: 'detailsToolbar',
                        title: '',
                        dock: 'top',
                        defaults: {iconMask: true},
                        items: [
                            {
                                iconCls: 'refresh',
                                handler: Weather.controllers.weather.refreshDetails
                            }
                        ]
                    }
                ],
                items: [
                    {
                        xtype: 'Details',
                        id: 'details'
                    }
                ]
            }
        ]
    })

    var getCelsius = function(f) {
        return Math.round((f - 32) * (5/9))
    }

    Ext.reg('CitiesList', Ext.extend(Ext.List, {
        store: 'CitiesStore',
        onItemDisclosure: true,
        itemTpl: new Ext.XTemplate(
              '<div style="margin-top: 5px; float: left;">{location.city}</div>'
            , '<div style="margin-top: 5px; margin-right: 10px; float: right">{[this.getLowTemp(values)]}&deg; - {[this.getHighTemp(values)]}&deg; C</div>'
            , {
                getLowTemp: function(v) {
                    return getCelsius(v.forecast[0].low_temperature)
                },
                getHighTemp: function(v) {
                    return getCelsius(v.forecast[0].high_temperature)
                }
              }),
        listeners: {
            disclose: function(rec) {
                Ext.dispatch({
                    controller: 'weather',
                    action: 'details',
                    historyUrl: 'weather/details/' + rec.data.id,
                    id: rec.data.id
                })
            }
        }
    }))

    Ext.reg('Details', Ext.extend(Ext.List, {
        itemTpl: '<div></div>',
        store: new Ext.data.JsonStore({model: 'LabelText'})
    }))

})()
