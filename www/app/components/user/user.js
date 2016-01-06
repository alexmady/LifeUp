/**
 * Created by alexmady on 07/11/15.
 */
angular.module('lifeUp.user', ['firebase'])

    .factory('UserProfile', ['$firebase', '$firebaseObject', 'FIREBASE_URL', 'courseMetaData',
        function( $firebase, $firebaseObject, FIREBASE_URL, courseMetaData ){

        // create a new service based on $firebaseObject
        var UserProfile = $firebaseObject.$extend({
            // these methods exist on the prototype, so we can access the data using `this`
            getProfile: function() {
                return this;
            },

            exists: function (){
                if (!this.created) return false;
                else return true;
            },

            create: function(user, setGoalsAnswers){

                var dt = new Date();
                this.created = dt.getTime();
                this.module = 0;
                this.slide =  0;
                this.moduleFar = 0;
                this.slideFar = 0;
                this.showPlayButton =  true;
                this.readyToClimb = false;
                this.firstLogin =  true;
                this.courseCompleted =  false;
                this.courseCompletedDate = null;
                this.completeCongratulate =  false;
                this.setGoalsAnswers = setGoalsAnswers;
                this.lastActivityDate = dt.getTime();
                this.resilienceComplete =  false;
                this.authenticityComplete =  false;
                this.connectionComplete = false;
                this.history = {};
                this.role = 'user';
                this.email = user.email;
                this.firstname = user.firstname;
                this.surname = user.surname;
                this.tag = user.tag;
                this.promoCode = user.promoCode;

                return this.$save();
            },

            updateCourseProgress: function (module, slide, readyToClimb) {

                this.module = module;
                this.slide = slide;
                var dt = new Date();
                this.lastActivityDate = dt.getTime();

                if (arguments[2]) {
                    this.readyToClimb = readyToClimb;
                    this.showPlayButton = !readyToClimb;
                }

                if (!this.history){
                    this.history = {};
                }

                if (module >= this.moduleFar) {

                    // if we have progressed to a higher module update module + slide
                    // else if its the same module only update the slide if its later in the course
                    if (module > this.moduleFar) {
                        this.moduleFar = module;
                        this.slideFar = slide;
                        this.history[this.lastActivityDate] = { module: this.moduleFar, slide: this.slideFar };

                    } else if (module === this.moduleFar) {
                        if (slide > this.slideFar) {
                            this.slideFar = slide;
                            this.history[this.lastActivityDate] = { module: this.moduleFar, slide: this.slideFar };
                        }
                    }
                    if (module === courseMetaData.length && slide === 1) {
                        this.courseCompleted = true;
                        var dt = new Date();
                        this.courseCompletedDate = dt.getTime();
                    }
                }

                var step = courseMetaData[module-1];
                if (step.badgeComplete === true && slide === step.length){
                    if (step.badge === 'resilience'){
                        this.resilienceComplete = true;
                    } else if ( step.badge === 'connection'){
                        this.connectionComplete = true;
                    } else if ( step.badge === 'authenticity'){
                        this.authenticityComplete = true;
                    }
                }

                this.$save();
                // update users position in the course here
                //console.log('Course module ' + module + ' slide ' + slide);
            }
        });

        return function(uid) {

            var ref = new Firebase(FIREBASE_URL+'/users');
            var profileRef = ref.child(uid);

            // return it as a synchronized object
            return new UserProfile(profileRef);
        }

    }]);


