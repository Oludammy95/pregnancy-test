// File: app/api/predict/antenatal/route.js
import { NextResponse } from "next/server";

export async function GET() {
  const antenatalArticle = {
    title: "Ante-Natal Care and Its Importance to Pregnant Women",
    sections: [
      {
        heading: "Introduction",
        paragraphs: [
          "Antenatal care, often called prenatal care, refers to the regular medical check-ups, health assessments, advice, and support a pregnant woman receives from healthcare professionals during the course of her pregnancy. The word 'antenatal' simply means 'before birth,' so antenatal care is all about ensuring both the mother and the unborn baby are healthy and well cared for before delivery.",
          "Pregnancy is a period of great change in a woman’s body. The growing baby depends entirely on the mother for nutrition, oxygen, and protection. Because of this, the mother’s health, habits, and environment directly affect the health of her unborn child. Antenatal care creates an opportunity for medical professionals to monitor these changes, detect problems early, and guide the woman through safe pregnancy practices."
        ]
      },
      {
        heading: "The Main Goals of Antenatal Care",
        list: [
          "Monitoring the health of the mother and baby",
          "Identifying and managing risks",
          "Providing health education",
          "Preparing for birth",
          "Promoting emotional support"
        ]
      },
      {
        heading: "What Happens During Antenatal Visits",
        list: [
          "Take a full medical history to understand any previous illnesses, surgeries, allergies, or pregnancy complications.",
          "Perform physical examinations, such as checking the abdomen, measuring fundal height, and listening to the baby’s heartbeat.",
          "Order laboratory tests, including blood tests for anemia, HIV, syphilis, hepatitis; urine tests for protein or infection; and glucose tests for gestational diabetes.",
          "Conduct ultrasounds to check the baby’s position, size, and development.",
          "Give supplements such as iron, folic acid, and sometimes calcium to support the baby’s development and prevent conditions like anemia or birth defects.",
          "Provide vaccinations, such as tetanus toxoid, to protect both mother and baby.",
          "Offer lifestyle advice on diet, rest, safe physical activity, avoiding harmful substances, and managing stress."
        ]
      },
      {
        heading: "Why Antenatal Care is Important",
        list: [
          "Early Detection of Health Problems",
          "Reducing the Risk of Pregnancy Complications",
          "Guidance on Proper Nutrition",
          "Prevention of Infections",
          "Emotional and Psychological Support",
          "Education on Warning Signs",
          "Planning for a Safe Delivery",
          "Improving Newborn Health",
          "Reducing Maternal Mortality",
          "Empowering Women"
        ]
      },
      {
        heading: "Consequences of Not Attending Antenatal Care",
        list: [
          "Complications may go undetected until they become life-threatening.",
          "The mother may not receive life-saving supplements or vaccinations.",
          "The baby may suffer from malnutrition, low birth weight, or preventable birth defects.",
          "Labor and delivery may be riskier if the mother has an undiagnosed condition.",
          "The emotional and psychological needs of the mother may be overlooked, leading to higher stress levels."
        ]
      },
      {
        heading: "The Role of Family and Community Support",
        paragraphs: [
          "While antenatal care is primarily provided by healthcare professionals, family and community support are also essential. Partners, relatives, and friends can encourage a pregnant woman to attend her appointments, help with transportation, and support her emotionally. Community health programs can raise awareness about the importance of antenatal care and provide outreach services in remote areas."
        ]
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "Antenatal care is not simply a routine series of medical visits; it is a comprehensive approach to ensuring the health and well-being of both mother and baby during pregnancy. It provides early detection and management of complications, education on healthy practices, emotional support, and preparation for a safe birth. For every pregnant woman, attending antenatal care is an investment in her own health and the health of her child."
        ]
      }
    ]
  };

  return NextResponse.json(antenatalArticle);
}
