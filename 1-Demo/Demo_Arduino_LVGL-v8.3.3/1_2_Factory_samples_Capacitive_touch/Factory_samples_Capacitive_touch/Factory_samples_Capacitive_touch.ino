// Modifications:
// - Chinese to English comment translation (via Google Translate)
// - Added screen rotation (touch follows rotation)
// Note: - It is necessary to use the library that accompanies this code,
//       updated versions may not compile
//       - Library configuration files need to be placed in the required locations

#include <lvgl.h>
#include <TFT_eSPI.h>
#include "CST820.h"
#include <demos/lv_demos.h>

// 0,1: Portrait; 1,3: Landscape
#define screenRotate 2

/* Change screen resolution */
#define screenSizeBig 320    // Bigger
#define screenSizeSmall 240  // Smaller

#if screenRotate == 0 || screenRotate == 2  // Portrait
static const uint16_t screenWidth = screenSizeSmall;
static const uint16_t screenHeight = screenSizeBig;
#elif screenRotate == 1 || screenRotate == 3  // Landscape
static const uint16_t screenWidth = screenSizeBig;
static const uint16_t screenHeight = screenSizeSmall;
#endif

/* Define touch screen pins */
#define I2C_SDA 33
#define I2C_SCL 32
#define TP_RST 25
#define TP_INT 21

static lv_disp_draw_buf_t draw_buf;
static lv_color_t *buf1;
static lv_color_t *buf2;

TFT_eSPI tft = TFT_eSPI();                      /* TFT example */
CST820 touch(I2C_SDA, I2C_SCL, TP_RST, TP_INT); /* Touch instance */

#if LV_USE_LOG != 0
/* Serial debug */
void my_print(const char *buf) {
  Serial.printf(buf);
  Serial.flush();
}
#endif
//_______________________
void lv_example_btn(void) {
  /* Attributes to convert */
  static lv_style_prop_t props[] = {
    LV_STYLE_TRANSFORM_WIDTH, LV_STYLE_TRANSFORM_HEIGHT, LV_STYLE_TEXT_LETTER_SPACE
  };

  /*Transition descriptor when going back to the default state.
     *Add some delay to be sure the press transition is visible even if the press was very short*/
  static lv_style_transition_dsc_t transition_dsc_def;
  lv_style_transition_dsc_init(&transition_dsc_def, props, lv_anim_path_overshoot, 250, 100, NULL);

  /*Transition descriptor when going to pressed state.
     *No delay, go to presses state immediately*/
  static lv_style_transition_dsc_t transition_dsc_pr;
  lv_style_transition_dsc_init(&transition_dsc_pr, props, lv_anim_path_ease_in_out, 250, 0, NULL);

  /*Add only the new transition to he default state*/
  static lv_style_t style_def;
  lv_style_init(&style_def);
  lv_style_set_transition(&style_def, &transition_dsc_def);

  /*Add the transition and some transformation to the presses state.*/
  static lv_style_t style_pr;
  lv_style_init(&style_pr);
  lv_style_set_transform_width(&style_pr, 10);
  lv_style_set_transform_height(&style_pr, -10);
  lv_style_set_text_letter_space(&style_pr, 10);
  lv_style_set_transition(&style_pr, &transition_dsc_pr);

  lv_obj_t *btn1 = lv_btn_create(lv_scr_act());
  lv_obj_align(btn1, LV_ALIGN_CENTER, 0, -80);
  lv_obj_add_style(btn1, &style_pr, LV_STATE_PRESSED);
  lv_obj_add_style(btn1, &style_def, 0);

  lv_obj_t *label = lv_label_create(btn1);
  lv_label_set_text(label, "btn1");

  /*Init the style for the default state*/
  static lv_style_t style;
  lv_style_init(&style);

  lv_style_set_radius(&style, 3);

  lv_style_set_bg_opa(&style, LV_OPA_100);
  lv_style_set_bg_color(&style, lv_palette_main(LV_PALETTE_BLUE));
  lv_style_set_bg_grad_color(&style, lv_palette_darken(LV_PALETTE_BLUE, 2));
  lv_style_set_bg_grad_dir(&style, LV_GRAD_DIR_VER);

  lv_style_set_border_opa(&style, LV_OPA_40);
  lv_style_set_border_width(&style, 2);
  lv_style_set_border_color(&style, lv_palette_main(LV_PALETTE_GREY));

  lv_style_set_shadow_width(&style, 8);
  lv_style_set_shadow_color(&style, lv_palette_main(LV_PALETTE_GREY));
  lv_style_set_shadow_ofs_y(&style, 8);

  lv_style_set_outline_opa(&style, LV_OPA_COVER);
  lv_style_set_outline_color(&style, lv_palette_main(LV_PALETTE_BLUE));

  lv_style_set_text_color(&style, lv_color_white());
  lv_style_set_pad_all(&style, 10);

  /*Init the pressed style*/
  static lv_style_t style_pr_2;
  lv_style_init(&style_pr_2);

  /*Ad a large outline when pressed*/
  lv_style_set_outline_width(&style_pr_2, 30);
  lv_style_set_outline_opa(&style_pr_2, LV_OPA_TRANSP);

  lv_style_set_translate_y(&style_pr_2, 5);
  lv_style_set_shadow_ofs_y(&style_pr_2, 3);
  lv_style_set_bg_color(&style_pr_2, lv_palette_darken(LV_PALETTE_BLUE, 2));
  lv_style_set_bg_grad_color(&style_pr_2, lv_palette_darken(LV_PALETTE_BLUE, 4));

  /*Add a transition to the the outline*/
  static lv_style_transition_dsc_t trans;
  static lv_style_prop_t props2[] = { LV_STYLE_OUTLINE_WIDTH, LV_STYLE_OUTLINE_OPA };
  lv_style_transition_dsc_init(&trans, props2, lv_anim_path_linear, 300, 0, NULL);

  lv_style_set_transition(&style_pr_2, &trans);

  lv_obj_t *btn2 = lv_btn_create(lv_scr_act());
  lv_obj_remove_style_all(btn2); /*Remove the style coming from the theme*/
  lv_obj_add_style(btn2, &style, 0);
  lv_obj_add_style(btn2, &style_pr_2, LV_STATE_PRESSED);
  lv_obj_set_size(btn2, LV_SIZE_CONTENT, LV_SIZE_CONTENT);
  lv_obj_center(btn2);

  lv_obj_t *label2 = lv_label_create(btn2);
  lv_label_set_text(label2, "Button");
  lv_obj_center(label2);
}
//_______________________
/* Display refresh */
void my_disp_flush(lv_disp_drv_t *disp, const lv_area_t *area, lv_color_t *color_p) {
  uint32_t w = (area->x2 - area->x1 + 1);
  uint32_t h = (area->y2 - area->y1 + 1);

  //tft.startWrite();
  tft.pushImageDMA(area->x1, area->y1, w, h, (uint16_t *)color_p);
  //tft.endWrite();

  lv_disp_flush_ready(disp);
}

/* Read the touchpad */
void my_touchpad_read(lv_indev_drv_t *indev_driver, lv_indev_data_t *data) {

  bool touched = false;
  bool touched2 = false;
  bool is_valid = false;
  uint8_t gesture = 0;
  uint16_t touchX = 0, touchY = 0;
  uint16_t touchX2 = 0, touchY2 = 0;

  for (uint8_t i = 0; i < 5; i++) {
    touched = touch.getTouch(&touchX, &touchY, &gesture);
    touched2 = touch.getTouch(&touchX2, &touchY2, &gesture2);
    
    if ((touched == touched2) && (touchX == touchX2) && (touchY == touchY2) && (gesture == gesture2)) {
      is_valid = true;

      break;
    }
  }

  if ((!touched) || (!is_valid)) {
    data->state = LV_INDEV_STATE_REL;
  } else {
    data->state = LV_INDEV_STATE_PR;

    /*Set the coordinates*/
#if screenRotate == 0 // Portrait
    data->point.x = touchX;
    data->point.y = touchY;
#elif screenRotate == 1  // Landscape
    data->point.y = screenHeight - touchX;
    data->point.x = touchY;
#elif screenRotate == 2  // Portrait
    data->point.x = screenWidth - touchX;
    data->point.y = screenHeight - touchY;
#elif screenRotate == 3  // Landscape
    data->point.y = touchX;
    data->point.x = screenWidth - touchY;
#endif

    // Serial.print("Touched: ");
    // Serial.print(data->point.x);
    // Serial.print(", ");
    // Serial.println(data->point.y);
  }
}

void setup() {
  Serial.begin(115200); /* Initialize the serial port */

  String LVGL_Arduino = "Hello Arduino! ";
  LVGL_Arduino += String('V') + lv_version_major() + "." + lv_version_minor() + "." + lv_version_patch();

  Serial.println(LVGL_Arduino);
  Serial.println("I am LVGL_Arduino");

  lv_init();

#if LV_USE_LOG != 0
  lv_log_register_print_cb(my_print); /* Register print function for debugging */
#endif
  pinMode(27, OUTPUT);
  digitalWrite(27, LOW);
  tft.begin();                   /* Initialization */
  tft.setRotation(screenRotate); /* Rotation */
  tft.initDMA();                 /* Initialize DMA */

  touch.begin(); /* Initialize the touchpad */
  digitalWrite(27, HIGH);
  tft.fillScreen(TFT_RED);
  delay(500);
  tft.fillScreen(TFT_GREEN);
  delay(500);
  tft.fillScreen(TFT_BLUE);
  delay(500);
  tft.fillScreen(TFT_BLACK);
  delay(500);

  buf1 = (lv_color_t *)heap_caps_malloc(sizeof(lv_color_t) * screenWidth * (screenHeight / 2), MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL);  //screenWidth * screenHeight/2
  buf2 = (lv_color_t *)heap_caps_malloc(sizeof(lv_color_t) * screenWidth * (screenHeight / 2), MALLOC_CAP_DMA | MALLOC_CAP_INTERNAL);

  lv_disp_draw_buf_init(&draw_buf, buf1, buf2, screenWidth * (screenHeight / 2));

  /* Initialize display */
  static lv_disp_drv_t disp_drv;
  lv_disp_drv_init(&disp_drv);
  /* Change the following line to display resolution */
  disp_drv.hor_res = screenWidth;
  disp_drv.ver_res = screenHeight;
  disp_drv.flush_cb = my_disp_flush;
  disp_drv.draw_buf = &draw_buf;
  lv_disp_drv_register(&disp_drv);

  /* Initialize the (virtual) input device driver */
  static lv_indev_drv_t indev_drv;
  lv_indev_drv_init(&indev_drv);
  indev_drv.type = LV_INDEV_TYPE_POINTER;
  indev_drv.read_cb = my_touchpad_read;
  lv_indev_drv_register(&indev_drv);

#if 0
    /* Create a simple label */
//    lv_obj_t *label = lv_label_create( lv_scr_act() );
//    lv_label_set_text( label, LVGL_Arduino.c_str() );
//    lv_obj_align( label, LV_ALIGN_CENTER, 0, 0 );
     lv_example_btn();
#else
  /* Try one of the examples from the lv_examples
    Arduino library Make sure you include it as written above.
    lv_example_btn_1();
   */

  // uncomment one of these demos
  lv_demo_widgets();  // OK
                      //lv_demo_benchmark(); // OK

  //  lv_demo_keypad_encoder();     // works, but I haven't an encoder
  //  lv_demo_music();              // NOK
  //  lv_demo_printer();
  //  lv_demo_stress();             // seems to be OK
#endif
  Serial.println("Setup done");
  tft.startWrite();
}

void loop() {
  lv_timer_handler(); /* Let the GUI do its job */
  delay(5);
}
