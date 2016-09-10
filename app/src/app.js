angular.module('baseballStatsApp', ['ngMaterial', 'ngMdIcons'])
    .config(function ($mdIconProvider, $mdThemingProvider) {
    // define the icon names for shortcuts and icon locations
    // $mdIconProvider
    //     .defaultIconSet()
    //     .icon();
    // define theme pallete
    $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');
});
