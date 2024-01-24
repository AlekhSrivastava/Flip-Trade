const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    // modified vrsion
    balance: {
        type: Number,
        default: 100
    },
    loan: {
        type: Number,
        default: 0
    }
});

// here we use function() to refer the instance of this user
// arrow .this use to acces variable in 
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next()
    }
    bcrypt.genSalt(16, (err, salt) => {
        if (err) {
            return next(err)
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err)
            }
            user.password = hash;
            next()
        })
    })

})

userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) return reject(err);
            if (!isMatch) {
                return reject(new Error('Passwords do not match'));
            }
            resolve(isMatch);
        })
    })
}

mongoose.model('User', userSchema);