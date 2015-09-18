<div class="container">
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<div class="panel panel-default">
				<div class="panel-body">
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
					<p>{{item.body}}</p>
				</div>
			</div>
			
			<div class="list-group">
				<div class="list-group-item" ng-repeat="(id, transactionItem) in transaction['items'] | orderBy :'update_timestamp' : true" style="height: 64px;">
					<div class="pull-right">
            			<img ng-src="{{transaction.owner.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-tiny">
            			<span class="app-text app-text-tiny">{{transaction.owner.name}}</span>
					</div>
					<div class="pull-left">
    					<span>{{transactionItem.status_label}}</span>, <span>{{transactionItem.update_timestamp * 1000 | date : 'short'}}</span><br/>
    					<span>{{transactionItem.text}}</span>
					</div>
				</div>
			</div>

			<div class="panel panel-default">
				<div class="panel-body">
    				<form>
    					<div class="form-group " ng-if="showFormElement('form-transactio-start')">
                    		<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    			<label for="form-transactio-start">Borrow date:</label>
                            	<datepicker date-format="fullDate" date-set="{{formTransactionData['start']}}">
                    			    <input type="text" readonly class="form-control" id="form-transactio-start" name="form-transactio-start" ng-model="formTransactionData['start']" ng-change="validateBorrowPeriod('start')"/>
                                </datepicker>
                    		</div>
                		</div>
    					<div class="form-group"  ng-if="showFormElement('form-transactio-end')">
                    		<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    			<label for="form-transactio-end">Return date:</label>
                            	<datepicker date-format="fullDate" date-set="{{formTransactionData['end']}}">
                    			    <input type="text" readonly class="form-control" id="form-transactio-end" name="form-transactio-end" ng-model="formTransactionData['end']" ng-change="validateBorrowPeriod('end')"/>
                                </datepicker>
                    		</div>
                		</div>
    					<div class="form-group" ng-class="{'has-error has-feedback' : formTransactionErrors['text']}" ng-if="showFormElement('form-transaction-text')">
	        				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 15px;">
        						<span class="help-block" ng-show="formTransactionErrors['text']">{{formTransactionErrors['text']}}</span>
        						<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true" ng-show="formTransactionErrors['text']"></span>
        						<textarea rows="10" class="form-control" id="form-transaction-text" name="form-transaction-text" placeholder="Give a decent reason, e.g. why need it? how to use? etc." ng-model="formTransactionData['text']"></textarea>
        					</div>
        				</div>
    				</form>
    				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 15px;">
        				<div class="btn-group" role="group" aria-label="">
                            <button type="button" class="btn btn-primary" ng-disabled="!validFormTransaction()" ng-click="submitForm('requested')" ng-if="showFormElement('form-transaction-submit-requested')">Request to borrow</button>
                        </div>
                    </div>
    			</div>
			</div>
		</div>
	</div>
</div>