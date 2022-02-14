const Item = require('../models/Item');
const Treasure = require('../models/Activity');
const Traveler = require('../models/Booking');
const Category = require('../models/Category');
const Bank = require('../models/Bank');
const Member = require('../models/Member');
const Booking = require('../models/Booking');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostPicked = await Item.find()
        .select('id title price city country unit imageId')
        .limit(5)
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const category = await Category.find()
        .select('id name')
        .limit(3)
        .populate({
          path: 'itemId',
          select: '_id title country city imageId isPopular',
          perDocumentLimit: 4,
          option: { sort: { sumBooking: -1 } },
          populate: {
            path: 'imageId',
            select: '_id imageUrl',
            perDocumentLimit: 1,
          },
        });

      const traveler = await Traveler.find();
      const treasure = await Treasure.find();
      const city = await Item.find();

      for (let i = 0; i < category.length; i++) {
        for (let x = 0; x < category[i].itemId.length; x++) {
          const item = await Item.findOne({ _id: category[i].itemId[x]._id });
          item.isPopular = false;
          await item.save();
          if (category[i].itemId[0] === category[i].itemId[x]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial2.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content: 'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        hero: {
          travelers: traveler.length,
          treasure: treasure.length,
          cities: city.length,
        },
        mostPicked,
        category,
        testimonial,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'internal server error' });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: 'featureId', select: '_id name qty imageUrl' })
        .populate({ path: 'activityId', select: '_id name type imageUrl' })
        .populate({ path: 'imageId', select: '_id imageUrl' });

      const bank = await Bank.find();

      testimonial = {
        _id: 'asd1293uasdads1',
        imageUrl: 'images/testimonial1.jpg',
        name: 'Happy Family',
        rate: 4.55,
        content: 'What a great trip with my family and I should try again next time soon ...',
        familyName: 'Angga',
        familyOccupation: 'Product Designer',
      };

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {
      res.status(500).json({ message: 'internal server error' });
    }
  },

  bookingPage: async (req, res) => {
    const { idItem, duration, bookingStartDate, bookingEndDate, firstName, lastName, email, phoneNumber, accountHolder, bankFrom } = req.body;

    if (!req.file) {
      return res.status(404).json({ message: 'image not found' });
    }

    if (
      idItem === undefined ||
      duration === undefined ||
      bookingStartDate === undefined ||
      bookingEndDate === undefined ||
      firstName === undefined ||
      lastName === undefined ||
      email === undefined ||
      phoneNumber === undefined ||
      accountHolder === undefined ||
      bankFrom === undefined
    ) {
      return res.status(404).json({ message: 'please complete all field' });
    }

    const item = await Item.findOne({ _id: idItem });

    if (!item) {
      return res.status(404).json({ message: 'item not found' });
    }

    item.sumBooking += 1;

    await item.save();

    const total = item.price * duration;
    const tax = total * 0.1;

    const invoice = Math.floor(1000000 + Math.random() * 9000000);

    const member = await Member.create({
      firstName,
      lastName,
      email,
      phoneNumber,
    });

    const newBooking = {
      invoice,
      bookingStartDate,
      bookingEndDate,
      total: total + tax,
      itemId: {
        _id: item.id,
        title: item.title,
        price: item.price,
        duration: duration,
      },
      memberId: member.id,
      payments: {
        proofPayment: `images/${req.file.filename}`,
        bankFrom: bankFrom,
        accountHolder: accountHolder,
      },
    };

    const booking = await Booking.create(newBooking);

    res.status(201).json({ message: 'Success booking', booking });
  },
};
