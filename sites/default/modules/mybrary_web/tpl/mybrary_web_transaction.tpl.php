<div class="container">
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<img ng-src="{{owner.pictureUrl}}" alt="avatar" class="app-icon app-icon-avatar-small">
			<span>{{owner.name}}</span>
			<div class="panel panel-default">
				<div class="panel-body">
					<div class="pull-left">
						<img ng-src="{{item.field_image[0].url}}" alt="picture"
							class="app-icon app-icon-avatar-small">
					</div>
					<div class="pull-left" style="padding-left: 1em;">
						<span>{{item.title}}</span><br />
						<span>{{terms[item.field_type].name}}</span><br />
						<span>{{item.model}}</span>
					</div>
					<p>{{item.body}}</p>
				</div>
			</div>
			<div class="panel panel-default" ng-if="transaction.status == <?php print MYBRARY_TRANSACTION_STATUS_UNKNOWN; ?>">
				<div class="panel-body">
				
    				<form>
    					<div class="form-group ">
                    		<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    			<label for="form-transactio-start">Borrow date:</label>
                            	<datepicker date-format="fullDate" date-set="{{formTransactionData['start']}}">
                    			    <input type="text" readonly class="form-control" id="form-transactio-start" name="form-transactio-start" ng-model="formTransactionData['start']" ng-change="validateBorrowPeriod('start')"/>
                                </datepicker>
                    		</div>
                		</div>
    					<div class="form-group">
                    		<div class="col-xs-12 col-sm-6 col-md-3 col-lg-3">
                    			<label for="form-transactio-end">Return date:</label>
                            	<datepicker date-format="fullDate" date-set="{{formTransactionData['end']}}">
                    			    <input type="text" readonly class="form-control" id="form-transactio-end" name="form-transactio-end" ng-model="formTransactionData['end']" ng-change="validateBorrowPeriod('end')"/>
                                </datepicker>
                    		</div>
                		</div>
    					<div class="form-group">
	        				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 15px;">
        						<textarea rows="10" class="form-control" id="form-transaction-text" name="form-transaction-text" placeholder="Give a decent reason, e.g. why need it? how to use? etc." ng-model="formTransactionData['text']"></textarea>
        					</div>
        				</div>
    				</form>
    				<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12" style="margin-top: 15px;">
        				<div class="btn-group" role="group" aria-label="">
                            <button type="button" class="btn btn-primary">Request to borrow</button>
                        </div>
                    </div>
    			</div>
			</div>
		</div>
	</div>
</div>