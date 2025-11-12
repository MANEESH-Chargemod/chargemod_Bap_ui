export const processPayment = async (req, res) => {
  try {
    const { transactionId, paymentMethod, amount, currency } = req.body;
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const paymentId = `pay_${Date.now()}`;
    const isSuccess = Math.random() > 0.1; // 90% success rate
    
    if (isSuccess) {
      res.json({
        success: true,
        data: {
          paymentId,
          status: 'COMPLETED',
          transactionId,
          amount,
          currency,
          paymentDate: new Date()
        },
        message: 'Payment processed successfully'
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment failed. Please try again.'
      });
    }
    
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment processing failed'
    });
  }
};

export const getPaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    // Simulate getting payment status
    res.json({
      success: true,
      data: {
        paymentId,
        status: 'COMPLETED',
        paymentDate: new Date()
      }
    });
    
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment status'
    });
  }
};