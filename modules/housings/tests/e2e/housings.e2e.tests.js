'use strict';

describe('Housings E2E Tests:', function () {
  describe('Test Housings page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/housings');
      expect(element.all(by.repeater('housing in housings')).count()).toEqual(0);
    });
  });
});
