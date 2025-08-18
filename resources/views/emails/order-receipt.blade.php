<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Receipt</title>
</head>
<body>
    <h1>Thanks for your purchase!</h1>
    <p>Order #{{ $order->id }} total: ${{ number_format((float)$order->total, 2) }}</p>
    <p>Your receipt is attached as a PDF.</p>
</body>
</html>
