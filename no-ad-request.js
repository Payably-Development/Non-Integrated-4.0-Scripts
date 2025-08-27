var searchParams = (new URLSearchParams(window.location.search));
var paymentType = 0; //0 = card, 1 = ach
var submitted = false;

function setMerchantConfiguration() {
    if (merchant.logoBanner != undefined && merchant.logoBanner != "") {
        $(".newlogoStep").attr('src', merchant.logoBanner);
    }
    if (merchant.imageBackground != undefined && merchant.imageBackground != "")
        $(".content-area").attr('style', "background-image: url(" + merchant.imageBackground + "); background-repeat: round;  background-attachment: fixed; background-size: contain; display:inline-flex; flex-direction: unset;");
    if (merchant.dbaText != undefined && merchant.dbaText != "") {
        //truncate text to avoid the page being cut
        var dbaText = merchant.dbaText;
        $('#merchant-custom-text-dba')[0].innerHTML = dbaText;
        var disclaimerACHText = $('#disclaimer-ach-text')[0].innerHTML;
        $('#disclaimer-ach-text')[0].innerHTML = disclaimerACHText.replace(/\[dba]/g, dbaText);
        var disclaimerCCText = $('#disclaimer-cc-text')[0].innerHTML;
        $('#disclaimer-cc-text')[0].innerHTML = disclaimerCCText.replace(/\[dba]/g, dbaText);
        var disclaimerCCFixedText = $('#disclaimer-cc-text-fixed')[0].innerHTML;
        $('#disclaimer-cc-text-fixed')[0].innerHTML = disclaimerCCFixedText.replace(/\[dba]/g, dbaText);
        var disclaimerCCNoFeeText = $('#disclaimer-cc-text-no-fee')[0].innerHTML;
        $('#disclaimer-cc-text-no-fee')[0].innerHTML = disclaimerCCNoFeeText.replace(/\[dba]/g, dbaText);
    }
    if (merchant.gratitudeText != undefined && merchant.gratitudeText != "") {
        var gratitudeText = merchant.gratitudeText;
        $('#merchant-custom-text-gratitude')[0].innerHTML = gratitudeText;
        var thankMessageSpanText = $('#thankMessageSpan')[0].innerHTML;
        $('#thankMessageSpan')[0].innerHTML = thankMessageSpanText.replace(/\[GratitudeText]/g, gratitudeText);
    }
    if (merchant.infoText != undefined && merchant.infoText != "") {
        var infoText = detectLink(merchant.infoText);
        $('#merchant-custom-text-info')[0].innerHTML = infoText;
    }
    if (merchant.addressText != undefined && merchant.addressText != "") {
        var addressText = detectLink(merchant.addressText);
        $('#merchant-custom-text-address')[0].innerHTML = addressText;
    }
    if (merchant.website != undefined && merchant.website != "") {
        var website = merchant.website;
        disclaimerACHText = $('#disclaimer-ach-text')[0].innerHTML;
        $('#disclaimer-ach-text')[0].innerHTML = disclaimerACHText.replace(/\[website]/g, website);
        $("#visit-btn").attr("href", merchant.website)
    }
    if (merchant.csn != undefined && merchant.csn != "") {
        var csn = merchant.csn;
        disclaimerACHText = $('#disclaimer-ach-text')[0].innerHTML;
        $('#disclaimer-ach-text')[0].innerHTML = disclaimerACHText.replace(/\[csn]/g, csn);
    }
    if (merchant.multiplePayMethod == false) {
        document.getElementById('achMethodDiv').style = "display: none;";
    }
    if (merchant.surchargeType.toLowerCase() == "fixed") {
        document.getElementById("convenience-fee-percentage").style.display = "none";
        document.getElementById("total-amount-percentage").style.display = "none";
    } else {
        document.getElementById("convenience-fee-fixed").style.display = "none";
        document.getElementById("total-amount-fixed").style.display = "none";
    }
    if (merchant.applySurcharge == true) {
        document.getElementById("totalAmountDiv").style.display = "none";
    } else {
        document.getElementById("totalAmountDivSurcharge").style.display = "none";
        document.getElementById('summary-convenience-fee').style = "display: none;";
        document.getElementById("convenience-fee-percentage").style.display = "none";
        document.getElementById("convenience-fee-fixed").style.display = "none";
    }

    if (merchant.surchargeAmount != undefined || merchant.surchargeAmount != "") {
        $('#fee-amount')[0].innerHTML = merchant.surchargeAmount
        $("#percent-fee-amount")[0].innerHTML = '0.00'
        $('#conFeeSpan')[0].innerHTML = `(${merchant.surchargeAmount}%):`
        $('#cc-disc-fee-per')[0].innerHTML = `${merchant.surchargeAmount}%`;
        $('#cc-disc-fee-fix')[0].innerHTML = `$${merchant.surchargeAmount}`;
    }
    if (merchant.themeColor == undefined || merchant.themeColor == "") {
        merchant.themeColor = "#2da137"
    }
    document.getElementById('paymentSpan1').style.color = merchant.themeColor;
    document.getElementById('paymentSpan2').style.color = merchant.themeColor;
    document.getElementById('paymentSpan3').style.color = merchant.themeColor;
    document.getElementById('cardMethodHR').style = `margin: 0; border: 1px solid ${merchant.themeColor}; border-radius: 7px 7px 7px 7px; height: 4px; width:100%; text-align:center; color:${merchant.themeColor}; background-color:${merchant.themeColor}; opacity: 1;`
}

function mmyyvalidator() {
    if (document.getElementById('UMexpir').value.length == 2) {
        document.getElementById('UMexpir').value = document.getElementById('UMexpir').value + '/';
    }
}

function lastNums(cardNum) {
    var cadena = "";
    if (cardNum.length == 15) {
        for (var i = 0; i < cardNum.length; i++) {
            if (i >= 11) {
                cadena = cadena + cardNum[i];

            } else {
                cadena += '*';
            }
        }
    }
    else if (cardNum.length == 16) {
        for (var i = 0; i < cardNum.length; i++) {
            if (i >= 12) {
                cadena = cadena + cardNum[i];
            }
            else {
                cadena = '*' + cadena;
            }
        }
    }
    document.getElementsByName('UMlastDigits')[0].value = cadena;
    return cadena;
};

function checkCard() {
    if (document.getElementsByName('UMcard')[0].value[0] == '' || document.getElementsByName('UMcard')[0].value[0] === undefined) {
        $("#cardLogo").attr("src", "https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/generic-card.svg");
    }

    else if (document.getElementsByName('UMcard')[0].value[0] == '3') {
        //American
        $("#cardLogo").attr("src", "https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/amexColor.png");
        document.getElementsByName('UMTypeCard')[0].value = 'American Express';
    }

    else if (document.getElementsByName('UMcard')[0].value[0] == '4') {
        //Visa
        $("#cardLogo").attr("src", "https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/visaColor.png");
        document.getElementsByName('UMTypeCard')[0].value = 'Visa';
    }

    else if (document.getElementsByName('UMcard')[0].value[0] == '5') {
        //Master
        $("#cardLogo").attr("src", "https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/masterCardColor.png");
        document.getElementsByName('UMTypeCard')[0].value = 'MasterCard';
    }

    else if (document.getElementsByName('UMcard')[0].value[0] == '6') {
        //Discovery
        $("#cardLogo").attr("src", "https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/discoverColor.png");
        document.getElementsByName('UMTypeCard')[0].value = 'Discovery';
    }

    else {
        $("#cardLogo").attr("src", "https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/generic-card.svg");
    }

    lastNums(document.getElementsByName('UMcard')[0].value);
};

function isCaptchaChecked() {
    return grecaptcha && grecaptcha.enterprise.getResponse.length !== 0;
}

function detectLink(linkString) {
    var phoneExp = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/img;
    var emailExp = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/img;
    var urlExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

    var phoneSubstring = linkString.match(phoneExp);
    var emailSubstring = linkString.match(emailExp);
    var urlSubstring = linkString.match(urlExp);

    if (phoneSubstring != null) {
        var phoneValue = phoneSubstring[0].replace(/[^0-9.]/g, '');
        linkString = linkString.replace(phoneSubstring[0], "<a href='tel:+" + phoneValue + "' style='color: #3f65fc;'>" + phoneSubstring[0] + "</a>");
    }

    if (emailSubstring != null) {
        linkString = linkString.replace(emailSubstring[0], "<a href='mailto:" + emailSubstring[0] + "' style='color: #3f65fc;'>" + emailSubstring[0] + "</a>")
    }

    if (urlSubstring != null) {
        var urlValue = urlSubstring[0].replace(/(^\w+:|^)\/\//, '');
        linkString = linkString.replace(urlSubstring[0], "<a href='" + urlSubstring[0] + "' style='color: #3f65fc;'>" + urlValue + "</a>");
    }

    return linkString;
}

function submitform() {
    if (submitted) {
        return false;
    }
    submitted = true;
    return true;
}

function onPay() {
    if (true) {
        validated = true;
        if (validateTwoStep()) {
            var amountValue = $("#paymentAmount").val();
            amountValue = amountValue.replace(/[^\d.]|\.(?=.*\.)/g, '');
            amountValue = parseFloat(amountValue).toFixed(2);
            document.getElementsByName('UMcustom2')[0].value = amountValue;

            var umCommand = document.getElementsByName('UMcommand')[0].value;

            $("#loadingGifDiv").css("visibility", "visible");
            if (merchant.applySurcharge && merchant.surchargeType.toLowerCase() != "fixed" && paymentType == 0) {
                var surChargePercentValue = parseFloat(merchant.surchargeAmount).toFixed(2);
                var surChargeAmount = amountValue * (surChargePercentValue / 100);
                var totalAmount = parseFloat(amountValue) + parseFloat(surChargeAmount);
                document.getElementsByName('UMamount')[0].value = totalAmount.toFixed(2);
                document.getElementsByName('UMdeposit')[0].value = amountValue;
                document.getElementsByName('UMconFee')[0].value = parseFloat(surChargeAmount).toFixed(2);
                document.getElementsByName('UMcustom1')[0].value = parseFloat(surChargeAmount).toFixed(2);
            } else if (merchant.applySurcharge && merchant.surchargeType.toLowerCase() == "fixed" && paymentType == 0) {
                var totalAmount = parseFloat(amountValue) + parseFloat(merchant.surchargeAmount);
                document.getElementsByName('UMamount')[0].value = totalAmount.toFixed(2);
                document.getElementsByName('UMdeposit')[0].value = amountValue;
                document.getElementsByName('UMconFee')[0].value = parseFloat(merchant.surchargeAmount).toFixed(2);
                document.getElementsByName('UMcustom1')[0].value = parseFloat(merchant.surchargeAmount).toFixed(2);
            } else {
                document.getElementsByName('UMamount')[0].value = amountValue
                document.getElementsByName('UMdeposit')[0].value = 0;
                document.getElementsByName('UMconFee')[0].value = 0;
            }

            if (paymentType != 0) {
                document.getElementsByName('UMcustom14')[0].value = $('#email-receipt').val();
            }
            else {
                document.getElementsByName('UMcustom14')[0].value = $('#email-receipt-card').val();
            }
            if (document.getElementsByName('UMTypeCard')[0].value != '') {
                document.getElementsByName('UMcustom15')[0].value = document.getElementsByName('UMTypeCard')[0].value
            } else {
                document.getElementsByName('UMcustom15')[0].value = ""
            }
            if (paymentType == 0) {
                document.getElementsByName('UMcustom16')[0].value = "card"
            } else {
                document.getElementsByName('UMcustom16')[0].value = "ach"
            }

            document.getElementsByName('UMcustom17')[0].value = amountValue;
            document.getElementsByName('UMline1cost')[0].value = amountValue;
            document.getElementsByName('UMcustom2')[0].value = amountValue;

            var invoiceNumber = $('#invoiceNumber-details').val();

            if (invoiceNumber.includes("EST")) {
                document.getElementsByName('UMcustom18')[0].value = invoiceNumber;
                invoiceNumber = invoiceNumber.substring(invoiceNumber.indexOf("INV") + 4);
                document.getElementsByName('UMinvoice')[0].value = invoiceNumber;
            } else {
                document.getElementsByName('UMcustom18')[0].value = invoiceNumber;
                document.getElementsByName('UMinvoice')[0].value = invoiceNumber;
            }

            $("#submit").click();
        }
    }
    else {
        validated = false;
        window.alert("Please check the reCAPTCHA box");
    }
}

function validateTwoStep() {
    paybtn = document.getElementById('paybtn');

    $("#failedContainer").addClass('hide');
    $("#failedContainer").removeClass('active');

    let amountToPay = parseFloat($("#paymentAmount").val().replaceAll(',', ''));
    if (isNaN(amountToPay)) {
        alert("Invalid Amount");
        return;
    }

    payBtnStatusEnabled(false);

    if (paymentType == 0) {
        //Pay with Card
        var Mcard = new RegExp(/^\d{15,16}$/);
        var Mcvv2 = new RegExp(/^\d{3,4}$/);
        var card = comparation("UMcard", Mcard);
        var cvv = comparation("UMcvv2", Mcvv2);

        if (!card) {
            alert("Invalid Card Number");
            payBtnStatusEnabled(true);
            return false;
        }

        if (document.getElementById('UMexpir').value.length == 0) {
            alert("Invalid Expiration Date");
            payBtnStatusEnabled(true);
            return false;
        }

        if (!cvv) {
            alert("Invalid CVV");
            payBtnStatusEnabled(true);
            return false;
        }

        //Check valid email filled
        var isValidEmail = validateEmail($("#email-receipt-card").val());
        if (!isValidEmail) {
            alert("Invalid Email");
            payBtnStatusEnabled(true);
            return false;
        }

        //Check valid Name on Card filled
        let isValidName = $('#card-name').val().length != 0;
        if (!isValidName) {
            alert("Invalid Name on Card");
            payBtnStatusEnabled(true);
            return false;
        }

        //Check valid Billing Address filled
        let isValidAddress = $('#billing-street').val().length != 0;
        if (!isValidAddress) {
            alert("Invalid Billing Address");
            payBtnStatusEnabled(true);
            return false;
        }

        //Check valid Zip Code filled
        let isValidZip = $('#zip-code').val().length != 0;
        if (!isValidZip) {
            alert("Invalid Postal Code");
            payBtnStatusEnabled(true);
            return false;
        }

        document.getElementById('UMemailreceipt').value = document.getElementById('email-receipt-card').value;
        document.getElementsByName('UMemail')[0].value = document.getElementById('email-receipt-card').value;

        var fullName = $('#card-name').val();
        var firstName = fullName.substring(0, fullName.indexOf(' '));
        var lastName = fullName.substring(fullName.indexOf(' ') + 1);

        document.getElementsByName('UMbillfname')[0].value = firstName;
        document.getElementsByName('UMbilllname')[0].value = lastName;
        document.getElementsByName('UMbillcompany')[0].value = $('#companyName-details').val();
        document.getElementsByName('UMname')[0].value = $('#card-name').val();
        document.getElementsByName('UMbillstreet')[0].value = $('#billing-street').val();
        document.getElementsByName('UMbillzip')[0].value = $('#zip-code').val()

        if (document.getElementsByName('UMTypeCard')[0].value == 'American Express') {
            document.getElementById('UMTypeC').value = '/images/amex.gif';
        } else if (document.getElementsByName('UMTypeCard')[0].value == 'Visa') {
            document.getElementById('UMTypeC').value = '/images/visa.gif';
        } else if (document.getElementsByName('UMTypeCard')[0].value == 'MasterCard') {
            document.getElementById('UMTypeC').value = '/images/mastercard.gif';
        } else if (document.getElementsByName('UMTypeCard')[0].value == 'Discover') {
            document.getElementById('UMTypeC').value = '/images/discover.gif';
        }

        payBtnStatusEnabled(true);
        return true;
    } else {
        //Pay with ACH
        var accountHolder = $('#account-holder').val();
        var routingNumber = $('#routing-number').val();
        var accountNumber = $('#account-number').val();
        var accountNumbConfirm = $('#account-number-confirm').val();
        var isValidEmail = validateEmail($("#email-receipt").val());

        if (isValidEmail && accountHolder != '' && routingNumber.length == 9 && accountNumber != '' && accountNumbConfirm != '' && accountNumber == accountNumbConfirm) {
            payBtnStatusEnabled(true);
        }
        else if (routingNumber.length < 9) {
            $("#routing-number-error").text('Invalid routing number');
            setErrorClass($("#routing-number-error"));
            alert("Invalid Routing Number");
            payBtnStatusEnabled(true);
            return false;
        }
        else if (accountNumber == "" || accountNumbConfirm == "") {
            alert('Invalid account number');
            validateAccountNumber({ data: { triggerAgain: false } });
            validateAccountNumberConf({ data: { triggerAgain: false } });
            payBtnStatusEnabled(true);
            return false;
        }
        else if (accountNumber != "" && accountNumbConfirm != "" && accountNumber != accountNumbConfirm) {
            validateAccountNumber({ data: { triggerAgain: false } });
            validateAccountNumberConf({ data: { triggerAgain: false } });
            payBtnStatusEnabled(true);
            alert("Account Number Different Message");
            return false;
        }
        else if (!isValidEmail) {
            alert("Invalid Email");
            payBtnStatusEnabled(true);
            return false;
        }
        else {
            alert("Please fill all fields before continuing");
            payBtnStatusEnabled(true);
            return false;
        }

        document.getElementById('UMemailreceipt').value = document.getElementById('email-receipt').value;
        document.getElementsByName('UMemail')[0].value = document.getElementById('email-receipt').value;

        document.getElementsByName('UMbillcompany')[0].value = $('#companyName-details').val();
        document.getElementsByName('UMaccounttype')[0].value = document.getElementById('account-type').value;
        document.getElementsByName('UMname')[0].value = document.getElementById('account-holder').value;
        document.getElementsByName('UMrouting')[0].value = document.getElementById('routing-number').value;
        document.getElementsByName('UMaccount')[0].value = document.getElementById('account-number').value;
        document.getElementsByName('UMbillfname')[0].value = document.getElementById('first-name').value
        document.getElementsByName('UMbilllname')[0].value = document.getElementById('last-name').value;

        payBtnStatusEnabled(true);
        return true;
    }

}

function comparation(value, regexp) {
    var temp = document.getElementById(value).value;
    if (regexp.test(temp)) {
        flag = true;
    }
    else {
        flag = false;
    }
    return flag;
}

$(document).keypress(function (event) {
    if (event.which == '13') {
        event.preventDefault();
    }
});


var infoColorCode = merchant.themeColor;
var step = 1;
let paybtn;
let transactionFinished = false;
let autocomplete;
let stepContainer1Hidden = false;
let stepContainer2Hidden = true;
let adsVersion = false;
let columnPercentage = "";
$(document).ready(function ($) {
    setMerchantConfiguration();

    if (searchParams.get('printer')) {
        var customer = searchParams.get('printer').replaceAll('*', ' ');
        document.getElementById('companyName-details').value = customer;
        document.getElementById('companyName').value = customer;

        $("#info-text-span")[0].innerHTML = `By clicking Pay Now, I agree to pay<strong>${customer}</strong> the above amount in accordance with the Card Issuer Agreement`;
        var thankMessageSpanText = $('#thankMessageSpan')[0].innerHTML;
        $('#thankMessageSpan')[0].innerHTML = thankMessageSpanText.replace(/\[accountName]/g, customer);
    } else if (searchParams.get('UMbillcompany')) {
        var customer = searchParams.get('UMbillcompany').replaceAll('*', ' ');
        document.getElementById('companyName-details').value = customer;
        document.getElementById('companyName').value = customer;

        $("#info-text-span")[0].innerHTML = `By clicking Pay Now, I agree to pay<strong>${customer}</strong> the above amount in accordance with the Card Issuer Agreement`;
        var thankMessageSpanText = $('#thankMessageSpan')[0].innerHTML;
        $('#thankMessageSpan')[0].innerHTML = thankMessageSpanText.replace(/\[accountName]/g, customer);
    }

    var invoiceNumber = searchParams.get('orderNumber') ?? searchParams.get('UMinvoice') ?? "";
    $("#invoiceNumber-details")[0].value = invoiceNumber;
    $("#invoice-paid-header")[0].innerHTML = `Invoice #${invoiceNumber} Paid`;
    $("#invoiceNumber")[0].innerHTML = invoiceNumber;


    /* Initialize properties and check payment scenarios */
    let achPaymentIsEnabled = merchant.multiplePayMethod;

    /* Choose to hide/show correct disclaimer texts */
    if (!merchant.applySurcharge) {
        $("#disclaimer-cc-text").hide();
        $("#disclaimer-cc-text-fixed").hide();
        $("#disclaimer-cc-text-no-fee").show();
    }
    else if (merchant.surchargeType.toLowerCase() == "fixed") {
        $("#disclaimer-cc-text").hide();
        $("#disclaimer-cc-text-no-fee").hide();
    } else {
        $("#disclaimer-cc-text-fixed").hide();
        $("#disclaimer-cc-text-no-fee").hide();
    }

    if (!achPaymentIsEnabled) {
        selectCreditDebitMethod();
    }

    /*Field listeners*/
    inititateListeners();

    /*Calculate amount total to pay*/
    calculateTotal();

    /* Set fancy progress style */
    $("#step1").toggleClass('step-progress');

    /* hide toggle buttons */
    $("#btnExpandStep1").hide();
    $("#btnExpandStep2").hide();

    /*Hide paymentAmountExceededLabel by default*/
    $("#paymentAmountExceededLabel").hide();

    /* Check if it's 'with Ads version' or not */
    let screenSize = $(window).width();
    adsVersion = false;
    columnPercentage = screenSize < 1920 ? "46%" : "48%";

    initAutoComplete();
});

function calculateTotal() {
    if ($("#paymentAmount").val().length != 0) {
        let invoiceAmount = parseFloat($("#paymentAmount").val().replaceAll(',', ''));
        const feeExist = merchant.applySurcharge;
        let feeAmount = 0;
        if (paymentType == 0 && feeExist) {
            const fee = merchant.surchargeAmount;
            if (merchant.surchargeType.toLowerCase() == "fixed") {
                feeAmount = fee;
            } else {
                feeAmount = invoiceAmount * (fee / 100);
            }
            $("#cvfpaidAmount").val(TwoDecimals(feeAmount));
        }

        const total = TwoDecimals(invoiceAmount + feeAmount);
        $("#total-amount").text(total);
        $("#fixed-total-amount").text(total);
        $("#percent-total-amount").text(total);
        $("#ach-total-amount").text(total);
        $("#paidAmount").val(total);

        // the new value entered on the field, convert it into 2 decimal value
        $("#fee-amount").text(TwoDecimals(feeAmount));
        $("#percent-fee-amount").text(TwoDecimals(feeAmount));
        $("#paymentAmount").val(TwoDecimals(invoiceAmount));
        $("#invoiceAmount").val(TwoDecimals(document.getElementsByName('UMamount')[0].value));
        $("#invoiceAmount2").val(TwoDecimals(invoiceAmount));
    }
}

function TwoDecimals(value) {
    return (Math.round(value * 100) / 100).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function expandStep(step) {
    if (step == 1) {
        if (stepContainer1Hidden) {
            expandStep1();
            collapseStep2();
        } else {
            collapseStep1();
            expandStep2();
        }
    } else {
        if (stepContainer2Hidden) {
            expandStep2();
            collapseStep1();
        } else {
            collapseStep2();
            expandStep1();
        }
    }

    if (stepContainer1Hidden) {
        document.getElementById('step1').classList.add('completed');
        document.getElementById('step1').classList.remove('active');
        document.getElementById('step2').classList.add('active');
    } else {
        document.getElementById('step1').classList.remove('completed');
        document.getElementById('step1').classList.add('active');
        document.getElementById('step2').classList.remove('active');
    }

    if (!stepContainer2Hidden) {
        document.getElementById('step2').classList.remove('completed');
        document.getElementById('step2').classList.add('active');
        document.getElementById('step3').classList.remove('active');
    }
}

function expandStep1() {
    $("#step1Container").show("slow");
    $("#toggle-btn-step1").attr('src', 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/arrow_down.png')
    stepContainer1Hidden = false;
}

function expandStep2() {
    $("#step2Container").show("slow");
    $("#toggle-btn-step2").attr('src', 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/arrow_down.png')
    $("#failedContainer").addClass('hide');
    $("#failedContainer").removeClass('active');
    stepContainer2Hidden = false;
}

function collapseStep1() {
    $("#step1Container").hide("slow");
    $("#toggle-btn-step1").attr('src', 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/arrow_up.png');
    stepContainer1Hidden = true;
}

function collapseStep2() {
    $("#step2Container").hide("slow");
    $("#toggle-btn-step2").attr('src', 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/arrow_up.png');
    stepContainer2Hidden = true;
}

function inititateListeners() {
    $("#paymentAmount").on("blur", calculateTotal);

    $("#card-name").on("blur", function () {
        let result = getFieldErrors("card", this.value, null);
        if (result.hasError) {
            $("#card-name-error").text(result.errorMessage);
            setErrorClass($("#card-name-error"));
        } else {
            removeErrorClass($("#card-name-error"));
        }
    });

    $("#billing-street").on("blur", function () {
        let result = getFieldErrors("street", this.value, null);
        if (result.hasError) {
            $("#billing-street-error").text(result.errorMessage);
            setErrorClass($("#billing-street-error"));
        } else {
            removeErrorClass($("#billing-street-error"));
        }
    });

    $("#zip-code").on("blur", function () {
        let result = getFieldErrors("zip", this.value, null);
        if (result.hasError) {
            $("#zip-code-error").text(result.errorMessage);
            setErrorClass($("#zip-code-error"));
        } else {
            removeErrorClass($("#zip-code-error"));
        }
    });

    $("#first-name").on("blur", function () {
        let result = getFieldErrors("first-name", this.value, null);
        if (result.hasError) {
            $("#first-name-error").text(result.errorMessage);
            setErrorClass($("#first-name-error"));
        } else {
            removeErrorClass($("#first-name-error"));
        }
    });

    $("#last-name").on("blur", function () {
        let result = getFieldErrors("last-name", this.value, null);
        if (result.hasError) {
            $("#last-name-error").text(result.errorMessage);
            setErrorClass($("#last-name-error"));
        } else {
            removeErrorClass($("#last-name-error"));
        }
    });

    $("#email-receipt").on("blur", function () {
        let result = getFieldErrors("email", this.value, null);
        if (result.hasError) {
            $("#email-error").text(result.errorMessage);
            setErrorClass($("#email-error"));
        } else {
            removeErrorClass($("#email-error"));
        }
    });

    $("#email-receipt-card").on("blur", function () {
        let result = getFieldErrors("email", this.value, null);
        if (result.hasError) {
            $("#email-error-card").text(result.errorMessage);
            setErrorClass($("#email-error-card"));
        } else {
            removeErrorClass($("#email-error-card"));
        }
    });

    $("#account-holder").on("blur", function () {
        let result = getFieldErrors("account-holder", this.value, null);
        if (result.hasError) {
            $("#account-holder-error").text(result.errorMessage);
            setErrorClass($("#account-holder-error"));
        } else {
            removeErrorClass($("#account-holder-error"));
        }
    });

    $("#routing-number").on("blur", function () {
        let result = getFieldErrors("routing-number", this.value, null);
        if (result.hasError) {
            $("#routing-number-error").text(result.errorMessage);
            setErrorClass($("#routing-number-error"));
        } else {
            removeErrorClass($("#routing-number-error"));
        }
    });

    $("#account-number").on("blur", validateAccountNumber);

    $("#account-number-confirm").on("blur", validateAccountNumberConf);
}

function validateAccountNumber(event) {
    $("#ach-account-last-digits").text($('#account-number').val().slice(-4));

    let result = getFieldErrors("account-number", $("#account-number").val(), $("#account-number-confirm").val());

    if (result.hasError) {
        $("#account-number-confirm-error").text(result.errorMessage);
        setErrorClass($("#account-number-confirm-error"));
    } else {
        removeErrorClass($("#account-number-confirm-error"));
    }

    if (event.data == undefined) {
        //time-out to "wait" intil the field refresh the new value
        setTimeout(() => {
            validateAccountNumberConf({ data: { triggerAgain: false } });
        }, 300)
    }
}

function validateAccountNumberConf(event) {
    let result = getFieldErrors("account-number", $("#account-number-confirm").val(), $("#account-number").val());
    if (result.hasError) {
        $("#account-number-error").text(result.errorMessage);
        setErrorClass($("#account-number-error"));
    } else {
        removeErrorClass($("#account-number-error"));
    }

    if (event.data == undefined) {
        //time-out to "wait" intil the field refresh the new value
        setTimeout(() => {
            validateAccountNumber({ data: { triggerAgain: false } });
        }, 300);
    }
}

function getFieldErrors(field, value, valueCompare) {
    let result = {
        hasError: false,
        errorMessage: null
    };

    switch (field) {
        case "card":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            break;
        case "street":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            break;
        case "zip":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            break;
        case "first-name":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            break;
        case "last-name":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            break;
        case "email":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            else if (!validateEmail(value)) {
                result.hasError = true;
                result.errorMessage = "Invalid email";
            }
            break;
        case "account-holder":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            break;
        case "routing-number":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            else if (value.length < 9) {
                result.hasError = true;
                result.errorMessage = "Invalid routing number";
            }
            break;
        case "account-number":
            if (value === "") {
                result.hasError = true;
                result.errorMessage = "This field is required";
            }
            else if (value != valueCompare) {
                result.hasError = true;
                result.errorMessage = "Account number does not match";
            }
            break;
    }

    return result;
}

function setErrorClass(field) {
    //Field is a JQ object
    field.addClass("field-error");
}

function removeErrorClass(field) {
    //Field is a JQ object
    field.removeClass("field-error");
}

function validateEmail(email) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(validRegex))
        return true;
    else
        return false;
}

function payBtnStatusEnabled(isEnabled) {
    if (isEnabled) {
        paybtn.classList.remove('disabled-link');
    } else {
        paybtn.classList.add('disabled-link');
    }
}

function nextStep() {
    /* Set fancy progress style */
    $("#step2").addClass('step-progress');

    //Set step 1 as inactive
    inactiveStep1();
    //Set step 2 as active
    activeStep2();

    $("#btnExpandStep1").show();
    $("#toggle-btn-step1").attr('src', 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/arrow_up.png');
    $("#btnExpandStep2").show();
    $("#toggle-btn-step2").attr('src', 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/arrow_down.png');
}

function activeStep1() {
    //document.getElementById('paymentFormTextDiv').classList.remove('inactive-step');
    //document.getElementById('step1Container').classList.remove('hide');
    stepContainer1Hidden = false;
    $("#step1Container").show("slow");
}

function inactiveStep1() {
    //Next step to stepper
    document.getElementById('step1').classList.add('completed');
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');

    //document.getElementById('paymentFormTextDiv').classList.add('inactive-step');
    //document.getElementById('step1Container').classList.add('hide');
    stepContainer1Hidden = true;
    $("#step1Container").hide("slow");
}

function activeStep2() {
    //document.getElementById('paymentDetailTextDiv').classList.remove('inactive-step');
    //document.getElementById('step2Container').classList.remove('hide');
    stepContainer2Hidden = false;
    $("#step2Container").show("slow");
}

function inactiveStep2() {
    document.getElementById('step2').classList.add('completed');
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');

    //document.getElementById('paymentDetailTextDiv').classList.add('inactive-step');
    //document.getElementById('step2Container').classList.add('hide');
    $("#step2Container").hide("slow");
    stepContainer2Hidden = true;
}

function getImageSrc(cardType) {
    var src = '';

    switch (cardType.toLowerCase()) {
        case "visa":
            src += 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/visaColor.png';
            break;
        case "master card":
            src += 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/masterCardColor.png';
            break;
        case "amex":
            src += 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/amexColor.png';
            break;
        case "discover":
            src += 'https://media.localsignal.com/files/35086035-b2c4-454e-bad7-f8471c003aa9/discoverColor.png';
            break;
        default:
            src = '';
            break;
    }

    return src;
}

function selectBankMethod() {
    paymentType = 1;
    document.getElementsByName('UMcheckformat')[0].value = "WEB"
    document.getElementsByName('UMcommand')[0].value = "check:sale"
    document.getElementById('payWithCard').style = "display: none;";
    document.getElementById('payWithACH').style = "display: block;";
    if (document.getElementById('cardMethodHR') != null) {
        document.getElementById('cardMethodHR').style = "display: none;";
    }

    if (document.getElementById('bankMethodHR') != null) {
        document.getElementById('bankMethodHR').style = "margin: 0; border: 1px solid " + infoColorCode + "; border-radius: 7px 7px 7px 7px; height: 4px; width:100%; text-align:center; color:" + infoColorCode + "; background-color:" + infoColorCode + "; opacity: 1; margin-top: 5.5%;";
    }

    document.getElementById('paymentType').value = "check:sale";
    document.getElementById('disclaimer-ach-text').style = "display:block";

    //disable discalimer texts from CC steps
    document.getElementById('disclaimer-cc-text').style = "display:none";
    document.getElementById('disclaimer-cc-text-no-fee').style = "display:none";
    document.getElementById('disclaimer-cc-text-fixed').style = "display:none";

    //If ACH payment selected, hide convenience fee
    if (document.getElementById("convenience-fee-percentage") != null) {
        document.getElementById("convenience-fee-percentage").style.display = "none";
    }

    if (document.getElementById("convenience-fee-fixed") != null) {
        document.getElementById("convenience-fee-fixed").style.display = "none";
    }

    if (document.getElementById('summary-convenience-fee') != null) {
        document.getElementById('summary-convenience-fee').style = "display: none;";
    }

    calculateTotal();
}

function selectCreditDebitMethod() {
    paymentType = 0;
    document.getElementsByName('UMcommand')[0].value = "sale"
    document.getElementById('payWithCard').style = "display: block;";
    document.getElementById('payWithACH').style = "display: none;";
    if (document.getElementById('bankMethodHR') != null) {
        document.getElementById('bankMethodHR').style = "display: none;";
    }

    if (document.getElementById('cardMethodHR') != null) {
        document.getElementById('cardMethodHR').style = "margin-left: 3%; border: 1px solid " + infoColorCode + "; border-radius: 7px 7px 7px 7px; height: 4px; width:100%; text-align:center; color:" + infoColorCode + "; background-color:" + infoColorCode + "; opacity: 1; margin-top: 5.5%; margin-bottom: 1.5%";
    }

    document.getElementById('paymentType').value = "sale";
    document.getElementById('disclaimer-ach-text').style = "display:none";
    //fixed = 0, percentage = 1
    if (merchant.surchargeType.toLowerCase() != "fixed" && merchant.applySurcharge) {
        document.getElementById('disclaimer-cc-text').style = "display:block";
        document.getElementById('disclaimer-cc-text-fixed').style = "display:none";
        document.getElementById('disclaimer-cc-text-no-fee').style = "display:none";
    } else if (merchant.surchargeType.toLowerCase() == "fixed" && merchant.applySurcharge) {
        document.getElementById('disclaimer-cc-text-fixed').style = "display:block";
        document.getElementById('disclaimer-cc-text').style = "display:none";
        document.getElementById('disclaimer-cc-text-no-fee').style = "display:none";
    } else {
        document.getElementById('disclaimer-cc-text-no-fee').style = "display:block";
        document.getElementById('disclaimer-cc-text').style = "display:none";
        document.getElementById('disclaimer-cc-text-fixed').style = "display:none";
    }

    //If CC payment selected, show convenience fee
    if (document.getElementById('convenience-fee') != null) {
        document.getElementById('convenience-fee').style = "display: block;";
    }

    if (document.getElementById("convenience-fee-percentage") != null && merchant.surchargeType.toLowerCase() != "fixed") {
        document.getElementById("convenience-fee-percentage").style.display = "block";
    }

    if (document.getElementById("convenience-fee-fixed") != null && merchant.surchargeType.toLowerCase() == "fixed") {
        document.getElementById("convenience-fee-fixed").style.display = "block";
    }

    if (document.getElementById('summary-convenience-fee') != null) {
        document.getElementById('summary-convenience-fee').style = "display: block;";
    }

    calculateTotal();
}