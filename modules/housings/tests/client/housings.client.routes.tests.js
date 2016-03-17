(function () {
  'use strict';

  describe('Housings Route Tests', function () {
    // Initialize global variables
    var $scope,
      HousingsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HousingsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HousingsService = _HousingsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('housings');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/housings');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          HousingsController,
          mockHousing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('housings.view');
          $templateCache.put('modules/housings/client/views/view-housing.client.view.html', '');

          // create mock Housing
          mockHousing = new HousingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Housing Name'
          });

          //Initialize Controller
          HousingsController = $controller('HousingsController as vm', {
            $scope: $scope,
            housingResolve: mockHousing
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:housingId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.housingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            housingId: 1
          })).toEqual('/housings/1');
        }));

        it('should attach an Housing to the controller scope', function () {
          expect($scope.vm.housing._id).toBe(mockHousing._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/housings/client/views/view-housing.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HousingsController,
          mockHousing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('housings.create');
          $templateCache.put('modules/housings/client/views/form-housing.client.view.html', '');

          // create mock Housing
          mockHousing = new HousingsService();

          //Initialize Controller
          HousingsController = $controller('HousingsController as vm', {
            $scope: $scope,
            housingResolve: mockHousing
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.housingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/housings/create');
        }));

        it('should attach an Housing to the controller scope', function () {
          expect($scope.vm.housing._id).toBe(mockHousing._id);
          expect($scope.vm.housing._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/housings/client/views/form-housing.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HousingsController,
          mockHousing;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('housings.edit');
          $templateCache.put('modules/housings/client/views/form-housing.client.view.html', '');

          // create mock Housing
          mockHousing = new HousingsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Housing Name'
          });

          //Initialize Controller
          HousingsController = $controller('HousingsController as vm', {
            $scope: $scope,
            housingResolve: mockHousing
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:housingId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.housingResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            housingId: 1
          })).toEqual('/housings/1/edit');
        }));

        it('should attach an Housing to the controller scope', function () {
          expect($scope.vm.housing._id).toBe(mockHousing._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/housings/client/views/form-housing.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
