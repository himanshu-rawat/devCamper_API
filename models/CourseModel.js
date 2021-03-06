const mongoose = require('mongoose');

const CourseSchmea = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [ true, 'Please add a course title' ]
	},
	description: {
		type: String,
		required: [ true, 'Please add a description' ]
	},
	weeks: {
		type: String,
		required: [ true, 'Please add Number of weeks' ]
	},
	tuition: {
		type: Number,
		required: [ true, 'Please add a tuition cost' ]
	},
	minimumSkill: {
		type: String,
		required: [ true, 'Please add a Minimum Skill' ],
		enum: [ 'beginner', 'intermediate', 'advanced' ]
	},
	scholarshipAvailable: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true
	}
});

// Static method to get avg of course tuitions
CourseSchmea.statics.getAverageCost = async function(bootcampId) {
	const obj = await this.aggregate([
		{
			$match: { bootcamp: bootcampId }
		},
		{
			$group: {
				_id: '$bootcamp',
				averageCost: { $avg: '$tuition' }
			}
		}
	]);
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10
		});
	} catch (error) {
		console.error(error);
	}
};

// Call getAverageCost after save
CourseSchmea.post('save', function() {
	this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before remove
CourseSchmea.pre('remove', function() {
	this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchmea);
