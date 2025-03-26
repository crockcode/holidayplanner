const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const mongoose = require('mongoose');
const Holiday = require('../models/Holiday');
const { addHoliday } = require('../controllers/holidayController');

describe('Holiday Controller Tests', () => {
  let req, res;

  beforeEach(() => {
    // Reset the request and response objects before each test
    req = {
      body: {
        name: 'Summer Vacation',
        destination: 'Hawaii',
        startDate: '2024-06-01',
        endDate: '2024-06-15',
        description: 'Beach vacation'
      },
      user: {
        _id: new mongoose.Types.ObjectId()
      }
    };

    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };
  });

  afterEach(() => {
    // Restore all stubs after each test
    sinon.restore();
  });

  describe('addHoliday', () => {
    it('should successfully create a holiday', async () => {
      // Arrange
      const createdHoliday = { ...req.body, _id: new mongoose.Types.ObjectId() };
      const createStub = sinon.stub(Holiday, 'create').resolves(createdHoliday);

      // Act
      await addHoliday(req, res);

      // Assert
      expect(createStub.calledOnce).to.be.true;
      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(createdHoliday)).to.be.true;
    });

    it('should handle errors when creating a holiday', async () => {
      // Arrange
      const error = new Error('Database error');
      sinon.stub(Holiday, 'create').rejects(error);

      // Act
      await addHoliday(req, res);

      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Error creating holiday' })).to.be.true;
    });

    it('should validate required fields', async () => {
      // Arrange
      req.body = {};

      // Act
      await addHoliday(req, res);

      // Assert
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: 'Please provide all required fields' })).to.be.true;
    });
  });
}); 