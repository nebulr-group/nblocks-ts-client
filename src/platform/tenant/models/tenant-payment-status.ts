export interface TenantPaymentStatus {
    /** Payment method is set up. We can bill this tenant */
    paymentsEnabled: boolean;

    /** The tenant should setup payment immediately because tenant has not setup payments and the subscribing plan carry a cost and the trial has ended */
    shouldSetupPayments: boolean;

    /** The tenant should immediately select a plan */
    shouldSelectPlan: boolean
}