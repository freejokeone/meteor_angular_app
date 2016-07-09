import angular from 'angular';

import angularMeteor from 'angular-meteor';

import template from './todosList.html';

import {Meteor} from 'meteor/meteor';

import {Tasks} from '../../api/tasks.js';

class TodosListCtrl{
	constructor($scope){
		$scope.viewModel(this);
		this.subscribe('tasks');
		this.hideComplated=false;
		this.helpers({
			tasks(){
				const selector={};
				if(this.getReactively('hideComplated')){
					selector.checked={
						$ne:true
					};
				}
			return Tasks.find(selector,{
				sort:{createdAt:-1}
			});
			},
			incomplateCount(){
				return Tasks.find({checked:{$ne:true}}).count();
			},
			currentUser(){
				return Meteor.user();
			}
		})
	};

	addTask(newTask){
	// Tasks.insert({
	// 	text:newTask,
	// 	createAt:new Date,
	// 	owner:Meteor.userId,
	// 	username:Meteor.user().username
	// 	});
	Meteor.call('tasks.insert',newTask);
	//clear form
	this.newTask="";
	};

	setChecked(task){
		// Tasks.update(task._id,{
		// 	$set:{
		// 		checked:!task.checked
		// 	},
		// });
		Meteor.call('tasks.setChecked',task._id,!task.checked);
	};

	removeTask(task){
		// Tasks.remove(task._id);
		Meteor.call('tasks.remove',task._id);
	};
	setPrivate(task){
		Meteor.call('tasks.setPrivate',task._id,!task.private);
	};
}



export default angular.module('todosList',[
	angularMeteor
]).component('todosList',{
	templateUrl:'imports/components/todosList/todosList.html',
	controller:['$scope',TodosListCtrl]
})