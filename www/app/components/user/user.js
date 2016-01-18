/**
 * Created by alexmady on 07/11/15.
 */
angular.module('lifeUp.user', ['firebase'])

    .factory('UserProfile', ['$firebase', '$firebaseObject', 'FIREBASE_URL', 'courseMetaData',
        function( $firebase, $firebaseObject, FIREBASE_URL, courseMetaData){

        // create a new service based on $firebaseObject
        var userProfile = $firebaseObject.$extend({


            // these methods exist on the prototype, so we can access the data using `this`
            getProfile: function() {
                return this;
            },

            exists: function (){
                if (!this.created) return false;
                else return true;
            },

            clear: function() {
                up= null;
            },


            getDeviceInfo: function(){

                var screen = {
                    width: window.screen.width,
                    height: window.screen.height,
                    pixelRatio: window.devicePixelRatio
                };

                var info =  {
                    deviceInformation: ionic.Platform.device(),
                    screen: screen
                };
                return info;
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
                this.deviceInfo = this.getDeviceInfo();
                return this.$save();
            },


            updateAudioProgress: function (audioName, event){

                var dt = new Date();
                this.lastAudioActivityDate = dt.getTime();

                if (!this.audioHistory){
                    this.audioHistory = {};
                }

                this.audioHistory[this.lastAudioActivityDate] = { audioName: audioName, audioEvent: event};
                this.$save();
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

        var up = null;

        function profileRef(uid){
            if(!up){
                console.log('Creating user profile - should only be once.');
                var ref = new Firebase(FIREBASE_URL+'/users');
                var pr = ref.child(uid);
                up = new userProfile(pr);
            }
            return up;
        }

        return profileRef;

    }]);


