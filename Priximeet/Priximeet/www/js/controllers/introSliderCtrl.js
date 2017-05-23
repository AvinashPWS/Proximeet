angular.module('ionicApp.introSliderCtrl', ['ngCordova'])
        .controller('introSliderCtrl', function ($scope, $ionicSideMenuDelegate, $state, $ionicHistory, $timeout, $location) {

            $scope.headerText = "Login screen";
            $scope.footerTExt = "Enrolling, publishing for a event requires logging in, can create own or use FaceBook or Google+/ Gmail";

            $scope.showSkipIntroBtn = eval(localStorage.showSkipIntroBtn);

            $scope.gotoHelp = function () {

                $timeout(function () {
                    $ionicSideMenuDelegate.canDragContent(true);
                    localStorage.isIntroOver = true;
                }, 10);

                $state.go('green.help');
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $ionicHistory.nextViewOptions({
                    disableBack: true,
                    disableAnimate: true,
                    historyRoot: true
                });
            };

            $ionicSideMenuDelegate.canDragContent(false);
            $scope.slideHasChanged = function (index) {
                //console.log(index)
                switch (index) {
                    case 0:
                        $scope.headerText = "Login screen";
                        $scope.footerTExt = "Enrolling, publishing for a event requires logging in, can create own or use FaceBook or Google+/ Gmail";
                        break;
                    case 1:
                        $scope.headerText = "Main search map screen";
                        $scope.footerTExt = "Events with location falling with in the search circle radius will show. Radius can be increased, location can be changed";
                        break;
                    case 2:
                        $scope.headerText = "Main menu";
                        $scope.footerTExt = "Access various functions from main menu including publishing a new event";
                        break;
                    case 3:
                        $scope.headerText = "Publish a new event screen";
                        $scope.footerTExt = "Choose the category, Fill up the details and submit the event";
                        break;
                    case 4:
                        $scope.headerText = "Category popup";
                        $scope.footerTExt = "Choose from listed pop up of categories, You can request a new category from Admin from HELP screen";
                        break;
                    case 5:
                        $scope.headerText = "Active events snap shot";
                        $scope.footerTExt = "This can be accessed using the three dots from any of the screens. It shows the snap shot of the events of your interest";
                        break;
                    case 6:
                        $scope.headerText = "Event view page with a enrolled user";
                        $scope.footerTExt = "Publisher can choose to accept / reject/ block the user. He can also chat clicking on the same";
                        break;
                    case 7:
                        $scope.headerText = "View published event";
                        $scope.footerTExt = "Shows with either uploaded photo or default category photo";
                        break;
                    case 8:
                        $scope.headerText = "Setting screen";
                        $scope.footerTExt = "Access various settings from this screen";
                        break;
                    case 9:
                        $scope.headerText = "Chat with user";
                        $scope.footerTExt = "Chat screen";
                        break;
                    case 10:
                        
                        if ($scope.showSkipIntroBtn === false) {
                            $scope.gotoHelp();
                            return false;
                        }
                        
                        $timeout(function () {
                            $ionicSideMenuDelegate.canDragContent(true);
                            localStorage.isIntroOver = true;
                        }, 10);

                        $state.go('green.search');
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $ionicHistory.nextViewOptions({
                            disableBack: true,
                            disableAnimate: true,
                            historyRoot: true
                        });
                        break;

                }
            }
        });
