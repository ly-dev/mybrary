<div class="container">
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <a class="btn btn-link" role="button" ui-sref="transaction-list"><i class="glyphicon glyphicon-menu-left"></i> My Transations</a>
        </div>
    </div>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="panel panel-default">
				<div class="panel-body">
					<div class="clearfix">
    					<div class="pull-right">
                			<img ng-src="{{owner.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
                			<span class="app-text app-text-tiny">{{owner.name}}</span>
    					</div>
    					<div class="pull-left">
    						<img ng-src="{{item.field_image[0].url}}" alt="picture" class="app-icon app-icon-avatar">
    					</div>
    					<div class="pull-left" style="padding-left: 1em;">
    						<span>{{item.title}}</span><br />
    						<span>{{terms[item.field_type].name}}</span><br />
    						<span>{{item.model}}</span>
    					</div>
					</div>
					<div class="clearfix">
    					<p>{{item.body}}</p>
    					<p>{{item.notAvailableMessage}}</p>
					</div>
				</div>
			</div>
			
			<div class="list-group">
				<div class="list-group-item" ng-repeat="(id, transactionItem) in transaction['items'] | orderBy :'update_timestamp' : true">
					<div>
            			<img ng-src="{{transactionItem.user.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny">{{transactionItem.user.name}}</span>
            			<span class="app-text app-text-tiny">{{transactionItem.update_timestamp * 1000 | date : 'dd/MM/yyyy HH:mm:ss'}}</span>
            			<span class="app-text app-text-tiny">{{transactionItem.status_label}}</span>
            			
					</div>
					<div>
    					<span>{{transactionItem.text}}</span>
					</div>
				</div>
			</div>

			<div class="panel panel-default" ng-show="noActionMessage">
				<div class="panel-body">
                	<span>{{noActionMessage}}</span>
            	</div>
        	</div>

			<div class="panel panel-default" ng-hide="noActionMessage">
				<div class="panel-body">
					<div class="pull-right">
            			<img ng-src="{{currentUser.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny">{{currentUser.name}}</span>
					</div>
    				<form>
    					<div class="form-group " ng-class="{'has-error has-feedback' : formTransactionErrors['start']}" ng-if="showFormElement('form-transactio-start')">
    						<span class="help-block" ng-show="formTransactionErrors['start']">{{formTransactionErrors['start']}}</span>
                    		<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    			<label for="form-transactio-start">Borrow date:</label>
                            	<datepicker date-format="fullDate" date-set="{{formTransactionData['start']}}">
                    			    <input type="text" readonly class="form-control" id="form-transactio-start" name="form-transactio-start" ng-model="formTransactionData['start']" ng-change="validateBorrowPeriod('start')"/>
                                </datepicker>
                    		</div>
                		</div>
    					<div class="form-group"  ng-class="{'has-error has-feedback' : formTransactionErrors['end']}" ng-if="showFormElement('form-transactio-end')">
    						<span class="help-block" ng-show="formTransactionErrors['end']">{{formTransactionErrors['end']}}</span>
                    		<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    			<label for="form-transactio-end">Return date:</label>
                            	<datepicker date-format="fullDate" date-set="{{formTransactionData['end']}}">
                    			    <input type="text" readonly class="form-control" id="form-transactio-end" name="form-transactio-end" ng-model="formTransactionData['end']" ng-change="validateBorrowPeriod('end')"/>
                                </datepicker>
                    		</div>
                		</div>
    					<div class="form-group" ng-class="{'has-error has-feedback' : formTransactionErrors['feedback']}" ng-if="showFormElement('form-transaction-feedback')">
	        				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 15px;">
        						<span class="help-block" ng-show="formTransactionErrors['feedback']">{{formTransactionErrors['feedback']}}</span>
        						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formTransactionErrors['feedback']"></span>
	    	    				<div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
        							<label for="form-transaction-feedback-3"><input type="radio" value="3" class="form-control" id="form-transaction-feedback-3" name="form-transaction-feedback-3" ng-model="formTransactionData['feedback']">Positive</label>
        						</div>
	    	    				<div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
        							<label for="form-transaction-feedback-2"><input type="radio" value="2" class="form-control" id="form-transaction-feedback-2" name="form-transaction-feedback-2" ng-model="formTransactionData['feedback']">Neutral</label>
        						</div>
	    	    				<div class="col-xs-4 col-sm-4 col-md-2 col-lg-2">
        							<label for="form-transaction-feedback-1"><input type="radio" value="1" class="form-control" id="form-transaction-feedback-1" name="form-transaction-feedback-1" ng-model="formTransactionData['feedback']">Negative</label>
        						</div>
        					</div>
        				</div>
        				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            				<div class="btn-group" role="group" aria-label="">
                                <button type="button" class="btn btn-default" ng-disabled="!validFormTransaction('cancelled')" ng-click="submitForm('cancelled')" ng-if="showFormElement('form-transaction-submit-cancelled')">Cancel</button>
                                <button type="button" class="btn btn-primary" ng-disabled="!validFormTransaction('confirmed')" ng-click="submitForm('confirmed')" ng-if="showFormElement('form-transaction-submit-confirmed')">Confirm</button>
                                <button type="button" class="btn btn-primary" ng-disabled="!validFormTransaction('returned')" ng-click="submitForm('returned')" ng-if="showFormElement('form-transaction-submit-returned')">Returned</button>
                            </div>
                        </div>
    					<div class="form-group" ng-class="{'has-error has-feedback' : formTransactionErrors['text']}" ng-if="showFormElement('form-transaction-text')">
	        				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 15px;">
        						<span class="help-block" ng-show="formTransactionErrors['text']">{{formTransactionErrors['text']}}</span>
        						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formTransactionErrors['text']"></span>
        						<textarea rows="5" class="form-control" id="form-transaction-text" name="form-transaction-text" placeholder="Give a decent explanation." ng-model="formTransactionData['text']"></textarea>
        					</div>
        				</div>
    				</form>
    				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 15px;">
        				<div class="btn-group" role="group" aria-label="">
                            <button type="button" class="btn btn-primary" ng-disabled="!validFormTransaction('requested')" ng-click="submitForm('requested')" ng-if="showFormElement('form-transaction-submit-requested')">Request</button>
                            <button type="button" class="btn btn-primary" ng-disabled="!validFormTransaction('request_changed')" ng-click="submitForm('request_changed')" ng-if="showFormElement('form-transaction-submit-request-changed')">Change</button>
                            <button type="button" class="btn btn-default" ng-disabled="!validFormTransaction('declined')" ng-click="submitForm('declined')" ng-if="showFormElement('form-transaction-submit-declined')">Decline</button>
                            <button type="button" class="btn btn-primary" ng-disabled="!validFormTransaction('feedback')" ng-click="submitForm('feedback')" ng-if="showFormElement('form-transaction-submit-feedback')">Feedback</button>
                        </div>
                    </div>
    			</div>
			</div>
		</div>
	</div>
</div>