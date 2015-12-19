/**
 * Created by alexmady on 10/12/15.
 */

    var steps = [
        {name: 'DISARM', pos: 1, frame: 0, duration: 0, backButtonEnabled: false, length: 6, badge: 'resilience', badgeComplete: false},
        {name: 'SPACE', pos: 2, frame: 208, duration: 6, backButtonEnabled: true, length: 5, badge: 'resilience', badgeComplete: true},
        {name: 'FLOW', pos: 3, frame: 345, duration: 5, backButtonEnabled: true, length: 4, badge: 'connection', badgeComplete: false},
        {name: 'ACT', pos: 4, frame: 520, duration: 6, backButtonEnabled: true, length: 3, badge: 'connection', badgeComplete: true},
        {name: 'BE', pos: 5, frame: 592, duration: 5, backButtonEnabled: true, length: 2, badge: 'authenticity', badgeComplete: false},
        {name: 'I', pos: 6, frame: 654, duration: 2, backButtonEnabled: true, length: 1, badge: 'authenticity', badgeComplete: true}
    ];

angular.module('lifeUp.courseMetaData', []).value('courseMetaData', steps);
