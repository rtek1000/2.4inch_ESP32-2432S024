/*Using LVGL with Arduino requires some extra steps:
 *Be sure to read the docs here: https://docs.lvgl.io/master/integration/framework/arduino.html  */

#include <lvgl.h>
#include "CST820.h"
#include <Wire.h>

#if LV_USE_TFT_ESPI
#include <TFT_eSPI.h>
#endif

/* Define touch screen pins */
#define I2C_SDA 33
#define I2C_SCL 32
#define TP_RST 25
#define TP_INT 21

// static lv_disp_draw_buf_t draw_buf;
// static lv_color_t *buf1;
// static lv_color_t *buf2;

TFT_eSPI tft = TFT_eSPI();                      /* TFT example */
CST820 touch(I2C_SDA, I2C_SCL, TP_RST, TP_INT); /* Touch instance - CST820 can operate from 10kHz to 400kHz*/

/*To use the built-in examples and demos of LVGL uncomment the includes below respectively.
 *You also need to copy `lvgl/examples` to `lvgl/src/examples`. Similarly for the demos `lvgl/demos` to `lvgl/src/demos`.
 *Note that the `lv_examples` library is for LVGL v7 and you shouldn't install it for this version (since LVGL v8)
 *as the examples and demos are now part of the main LVGL library. */

//#include <examples/lv_examples.h>
//#include <demos/lv_demos.h>

/*Set to your screen resolution and rotation*/
#define screenSizeBig 320    // Bigger
#define screenSizeSmall 240  // Smaller
#define TFT_ROTATION LV_DISPLAY_ROTATION_270

#if TFT_ROTATION == LV_DISPLAY_ROTATION_0 || TFT_ROTATION == LV_DISPLAY_ROTATION_180  // Portrait
#define TFT_HOR_RES screenSizeSmall
#define TFT_VER_RES screenSizeBig
#elif TFT_ROTATION == LV_DISPLAY_ROTATION_90 || TFT_ROTATION == LV_DISPLAY_ROTATION_270  // Landscape
#define TFT_HOR_RES screenSizeBig
#define TFT_VER_RES screenSizeSmall
#endif

/*LVGL draw into this buffer, 1/10 screen size usually works well. The size is in bytes*/
#define DRAW_BUF_SIZE (TFT_HOR_RES * TFT_VER_RES / 10 * (LV_COLOR_DEPTH / 8))
uint32_t draw_buf[DRAW_BUF_SIZE / 4];

#if LV_USE_LOG != 0
void my_print(lv_log_level_t level, const char* buf) {
  LV_UNUSED(level);
  Serial.println(buf);
  Serial.flush();
}
#endif

/* LVGL calls it when a rendered image needs to copied to the display*/
void my_disp_flush(lv_display_t* disp, const lv_area_t* area, uint8_t* px_map) {
  /*Copy `px map` to the `area`*/

  uint32_t w = (area->x2 - area->x1 + 1);
  uint32_t h = (area->y2 - area->y1 + 1);

  //tft.startWrite();
  tft.pushImageDMA(area->x1, area->y1, w, h, (uint16_t*)px_map);
  //tft.endWrite();

  /*Call it to tell LVGL you are ready*/
  lv_display_flush_ready(disp);
}

/*Read the touchpad*/
void my_touchpad_read(lv_indev_t* indev, lv_indev_data_t* data) {
  // Checks if Touchscreen was touched, and prints X, Y and Pressure (Z)
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
    data->state = LV_INDEV_STATE_RELEASED;
  } else {
    data->state = LV_INDEV_STATE_PRESSED;

    if ((TFT_ROTATION == LV_DISPLAY_ROTATION_0) || (TFT_ROTATION == LV_DISPLAY_ROTATION_180)) {  // Portrait
      x = touchX;
      y = touchY;
    } else {  // if ((TFT_ROTATION == LV_DISPLAY_ROTATION_90) || (TFT_ROTATION == LV_DISPLAY_ROTATION_270)) {  // Landscape
      x = TFT_HOR_RES - touchX;
      y = TFT_VER_RES - touchY;
    }

    if (x < 0) x = 0;
    if (y < 0) y = 0;

    /*Set the coordinates*/
    data->point.x = x;
    data->point.y = y;

    // Serial.print("Touched: ");
    // Serial.print(x);
    // Serial.print(", ");
    // Serial.println(y);
  }
}

/*use Arduinos millis() as tick source*/
static uint32_t my_tick(void) {
  return millis();
}

static int hr1 = 12;
static int min1 = 0;
static int sec1 = 0;

lv_obj_t* label_notif;

void timer1_tick(lv_timer_t* timer) {
  if (sec1 < 59) {
    sec1++;
  } else {
    sec1 = 0;

    if (min1 < 59) {
      min1++;
    } else {
      min1 = 0;

      if (hr1 < 23) {
        hr1++;
      } else {
        hr1 = 0;
      }
    }
  }

  lv_label_set_text_fmt(label_notif, "%02d:%02d:%02d", hr1, min1, sec1);
}

lv_obj_t* mbox1;

static void event_msgbox_cb(lv_event_t* e) {
  lv_obj_t* btn = lv_event_get_target_obj(e);
  lv_obj_t* label = lv_obj_get_child(btn, 0);
  LV_UNUSED(label);
  String txt1 = lv_label_get_text(label);

  if (txt1 == "Apply") {
    sec1 = 0;
    min1 = 0;
    hr1 = 12;
  }

  LV_LOG_USER("Button %s clicked", txt1);

  lv_msgbox_close(mbox1);
}

// Callback that is triggered when btn1 is clicked
static void event_btn1_cb(lv_event_t* e) {
  lv_event_code_t code = lv_event_get_code(e);
  if (code == LV_EVENT_CLICKED) {
    // Create Message Box:
    mbox1 = lv_msgbox_create(NULL);

    lv_msgbox_add_title(mbox1, "Clock");
    lv_msgbox_add_text(mbox1, "Do you want to\nreset the count?");
    lv_msgbox_add_close_button(mbox1);

    lv_obj_t* btn;
    btn = lv_msgbox_add_footer_button(mbox1, "Apply");
    lv_obj_add_event_cb(btn, event_msgbox_cb, LV_EVENT_CLICKED, NULL);
    btn = lv_msgbox_add_footer_button(mbox1, "Cancel");
    lv_obj_add_event_cb(btn, event_msgbox_cb, LV_EVENT_CLICKED, NULL);
  }
}

void setup() {
  String LVGL_Arduino = "Hello Arduino! ";
  LVGL_Arduino += String('V') + lv_version_major() + "." + lv_version_minor() + "." + lv_version_patch();

  Serial.begin(115200);
  Serial.println(LVGL_Arduino);

  lv_init();

  pinMode(27, OUTPUT);
  digitalWrite(27, LOW);

  tft.begin(); /* Initialization */
  // tft.setRotation(screenRotate); /* Rotation */
  tft.initDMA(); /* Initialize DMA */

  digitalWrite(27, HIGH);

  tft.fillScreen(TFT_RED);
  delay(500);
  tft.fillScreen(TFT_GREEN);
  delay(500);
  tft.fillScreen(TFT_BLUE);
  delay(500);
  tft.fillScreen(TFT_BLACK);
  delay(500);

  /*Set a tick source so that LVGL will know how much time elapsed. */
  lv_tick_set_cb(my_tick);

  /* register print function for debugging */
#if LV_USE_LOG != 0
  lv_log_register_print_cb(my_print);
#endif

  lv_display_t* disp;
#if LV_USE_TFT_ESPI
  /*TFT_eSPI can be enabled lv_conf.h to initialize the display in a simple way*/
  disp = lv_tft_espi_create(TFT_HOR_RES, TFT_VER_RES, draw_buf, sizeof(draw_buf));
  lv_display_set_rotation(disp, TFT_ROTATION);

#else
  /*Else create a display yourself*/
  disp = lv_display_create(TFT_HOR_RES, TFT_VER_RES);
  lv_display_set_flush_cb(disp, my_disp_flush);
  lv_display_set_buffers(disp, draw_buf, NULL, sizeof(draw_buf), LV_DISPLAY_RENDER_MODE_PARTIAL);
#endif

  /*Initialize the (dummy) input device driver*/
  lv_indev_t* indev = lv_indev_create();
  lv_indev_set_type(indev, LV_INDEV_TYPE_POINTER); /*Touchpad should have POINTER type*/
  lv_indev_set_read_cb(indev, my_touchpad_read);

  /* Create a simple label
     * ---------------------
     lv_obj_t *label = lv_label_create( lv_screen_active() );
     lv_label_set_text( label, "Hello Arduino, I'm LVGL!" );
     lv_obj_align( label, LV_ALIGN_CENTER, 0, 0 );

     * Try an example. See all the examples
     *  - Online: https://docs.lvgl.io/master/examples.html
     *  - Source codes: https://github.com/lvgl/lvgl/tree/master/examples
     * ----------------------------------------------------------------

     lv_example_btn_1();

     * Or try out a demo. Don't forget to enable the demos in lv_conf.h. E.g. LV_USE_DEMO_WIDGETS
     * -------------------------------------------------------------------------------------------

     lv_demo_widgets();
     */

  // Create a Label
  lv_obj_t* label = lv_label_create(lv_screen_active());
  lv_label_set_text(label, "Hello my dear, I'm LVGL!");
  lv_obj_align(label, LV_ALIGN_CENTER, 0, -50);

  // Create a Clock
  label_notif = lv_label_create(lv_screen_active());
  lv_label_set_text(label_notif, "12:00:00");
  lv_obj_align(label_notif, LV_ALIGN_CENTER, 0, 0);

  static uint32_t user_data = 10;

  lv_timer_t* timer1 = lv_timer_create(timer1_tick, 1000, &user_data);

  // Create a Button (btn1)
  lv_obj_t* btn1 = lv_button_create(lv_screen_active());
  lv_obj_add_event_cb(btn1, event_btn1_cb, LV_EVENT_ALL, NULL);
  lv_obj_align(btn1, LV_ALIGN_CENTER, 0, +50);
  lv_obj_remove_flag(btn1, LV_OBJ_FLAG_PRESS_LOCK);

  lv_obj_t* btn_label = lv_label_create(btn1);
  lv_label_set_text(btn_label, "Reset");
  lv_obj_center(btn_label);

  touch.begin(); /* Initialize the touchpad */

  Wire.setClock(400000); // set I2C speed, add it after touch.begin() to speed up

  Serial.println("Setup done");
}

void loop() {
  lv_timer_handler(); /* let the GUI do its work */
  delay(1);           // let this time pass
}
