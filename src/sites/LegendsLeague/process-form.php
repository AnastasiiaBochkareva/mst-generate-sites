<?php
// if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $inquiry = $_POST["srvc"];
    $name = $_POST["name"];
    $email = $_POST["mail"];
    $phone = $_POST["phone"];


    
	//Получение имени домена на котором будет стоять верстка
	$recipient = "mail@" . $_SERVER['HTTP_HOST'];

	$formcontent = "Name: $name \n Phone: $phone \n Email: $email \n Mess: $inquiry";

	$mailheader = "From: $recipient \r\n";

    // Add any additional form fields as needed

    // Retrieve the dynamically set email from the form attribute
    // $to = $_POST["data-email"]; // Use the attribute set in the JavaScript

    $subject = "New Form Submission";
    // $message = "Inquiry: $inquiry\nName: $name\nEmail: $email\nPhone: $phone";

    // Add any additional form fields to the message as needed

    // Send the email
    // mail($to, $subject, $message);
	mail($recipient, $subject, $formcontent, $mailheader) or die("Error!");

    // Redirect to thanks.html after successful submission
    header("Location: thanks.html");
    exit; // Ensure that no further code is executed after the header redirection
// }
?>
