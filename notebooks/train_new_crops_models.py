import os
import numpy as np
import tensorflow as tf
from PIL import Image, ImageDraw, ImageFilter

CROPS_CONFIG = {
    "Carrot": {
        "classes": ["Carrot___Leaf_blight", "Carrot___Powdery_mildew", "Carrot___healthy"],
        "onnx_name": "../public/Carrot.onnx",
        "h5_name": "../public/Carrot.h5",
        "test_dir": "../public/test-images/carrot",
        "draw_fn": "carrot"
    },
    "Cabbage": {
        "classes": ["Cabbage___Black_rot", "Cabbage___Downy_mildew", "Cabbage___healthy"],
        "onnx_name": "../public/Cabbage.onnx",
        "h5_name": "../public/Cabbage.h5",
        "test_dir": "../public/test-images/cabbage",
        "draw_fn": "cabbage"
    },
    "Cauliflower": {
        "classes": ["Cauliflower___Black_rot", "Cauliflower___Bacterial_soft_rot", "Cauliflower___healthy"],
        "onnx_name": "../public/Cauliflower.onnx",
        "h5_name": "../public/Cauliflower.h5",
        "test_dir": "../public/test-images/cauliflower",
        "draw_fn": "cauliflower"
    },
    "Brinjal": {
        "classes": ["Brinjal___Phomopsis_blight", "Brinjal___Little_leaf", "Brinjal___healthy"],
        "onnx_name": "../public/Brinjal.onnx",
        "h5_name": "../public/Brinjal.h5",
        "test_dir": "../public/test-images/brinjal",
        "draw_fn": "brinjal"
    }
}

def generate_crop_image(crop_type, class_name):
    """Generates synthetic leaf/crop image with visual features for training."""
    img = Image.new("RGB", (224, 224), color=(245, 245, 240))
    draw = ImageDraw.Draw(img)
    
    if crop_type == "carrot":
        # Fine feathery green carrot fronds
        if "healthy" in class_name:
            color = (30, 180, 50)
            for x in range(30, 200, 15):
                draw.line([(x, 224), (x + np.random.randint(-20, 20), 20)], fill=color, width=3)
                draw.line([(x, 100), (x - 20, 70)], fill=(40, 200, 60), width=2)
                draw.line([(x, 120), (x + 20, 90)], fill=(40, 200, 60), width=2)
        elif "Leaf_blight" in class_name:
            color = (130, 100, 40)
            for x in range(30, 200, 15):
                draw.line([(x, 224), (x + np.random.randint(-20, 20), 20)], fill=color, width=3)
            # Dark brown lesions
            for _ in range(8):
                cx, cy = np.random.randint(40, 180), np.random.randint(40, 180)
                draw.ellipse([cx-10, cy-10, cx+10, cy+10], fill=(80, 40, 10))
        elif "Powdery_mildew" in class_name:
            color = (50, 140, 60)
            for x in range(30, 200, 15):
                draw.line([(x, 224), (x + np.random.randint(-20, 20), 20)], fill=color, width=3)
            # White powdery coating patches
            for _ in range(6):
                cx, cy = np.random.randint(40, 180), np.random.randint(40, 180)
                draw.ellipse([cx-18, cy-18, cx+18, cy+18], fill=(235, 235, 235))

    elif crop_type == "cabbage":
        # Broad round waxy cabbage leaf
        if "healthy" in class_name:
            fill_color = (40, 170, 80)
            draw.ellipse([30, 20, 194, 204], fill=fill_color)
            # Thick white midrib veins
            draw.line([(112, 204), (112, 30)], fill=(220, 240, 220), width=8)
            draw.line([(112, 130), (50, 80)], fill=(210, 235, 210), width=4)
            draw.line([(112, 130), (170, 80)], fill=(210, 235, 210), width=4)
        elif "Black_rot" in class_name:
            fill_color = (50, 130, 60)
            draw.ellipse([30, 20, 194, 204], fill=fill_color)
            # V-shaped black/brown margin lesions
            draw.polygon([(30, 40), (80, 90), (30, 140)], fill=(40, 30, 20))
            draw.polygon([(194, 40), (144, 90), (194, 140)], fill=(40, 30, 20))
            draw.line([(112, 204), (112, 30)], fill=(60, 50, 40), width=8)
        elif "Downy_mildew" in class_name:
            fill_color = (120, 160, 60)
            draw.ellipse([30, 20, 194, 204], fill=fill_color)
            # Yellowish patches with grayish downy mold
            for _ in range(5):
                cx, cy = np.random.randint(50, 170), np.random.randint(50, 170)
                draw.ellipse([cx-20, cy-20, cx+20, cy+20], fill=(210, 210, 110))
                draw.ellipse([cx-10, cy-10, cx+10, cy+10], fill=(150, 140, 160))

    elif crop_type == "cauliflower":
        # Oval ribbed leaf
        if "healthy" in class_name:
            fill_color = (30, 140, 70)
            draw.ellipse([40, 10, 184, 214], fill=fill_color)
            draw.line([(112, 214), (112, 20)], fill=(240, 245, 235), width=10)
        elif "Black_rot" in class_name:
            fill_color = (40, 110, 50)
            draw.ellipse([40, 10, 184, 214], fill=fill_color)
            # Blackened leaf tips and margins
            draw.ellipse([70, 10, 154, 70], fill=(30, 25, 20))
            draw.ellipse([40, 80, 80, 140], fill=(30, 25, 20))
        elif "Bacterial_soft_rot" in class_name:
            fill_color = (110, 130, 50)
            draw.ellipse([40, 10, 184, 214], fill=fill_color)
            # Water-soaked dark mushy rot patches
            for _ in range(4):
                cx, cy = np.random.randint(60, 160), np.random.randint(40, 180)
                draw.ellipse([cx-22, cy-22, cx+22, cy+22], fill=(60, 50, 25))

    elif crop_type == "brinjal":
        # Large egg-shaped leaves with purple-tinged veins
        if "healthy" in class_name:
            fill_color = (40, 160, 60)
            draw.ellipse([35, 15, 189, 209], fill=fill_color)
            draw.line([(112, 209), (112, 20)], fill=(90, 40, 110), width=5)
            draw.line([(112, 110), (55, 60)], fill=(90, 40, 110), width=3)
            draw.line([(112, 110), (169, 60)], fill=(90, 40, 110), width=3)
        elif "Phomopsis_blight" in class_name:
            fill_color = (60, 120, 50)
            draw.ellipse([35, 15, 189, 209], fill=fill_color)
            # Circular dark brown spots with pale centers
            for _ in range(5):
                cx, cy = np.random.randint(50, 170), np.random.randint(40, 170)
                draw.ellipse([cx-18, cy-18, cx+18, cy+18], fill=(90, 45, 20))
                draw.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(180, 150, 110))
        elif "Little_leaf" in class_name:
            # Stunted small light-green leaves
            fill_color = (140, 200, 80)
            for _ in range(7):
                cx, cy = np.random.randint(40, 180), np.random.randint(40, 180)
                draw.ellipse([cx-15, cy-15, cx+15, cy+15], fill=fill_color)

    return img

def train_and_export_crop(crop_name, config):
    print(f"\n==========================================")
    print(f"  Training CNN for {crop_name}")
    print(f"==========================================")
    
    classes = config["classes"]
    dataset_dir = f"./dataset_{crop_name.lower()}"
    os.makedirs(dataset_dir, exist_ok=True)
    os.makedirs(config["test_dir"], exist_ok=True)
    
    np.random.seed(42)
    images_per_class = 250
    sample_saved = {c: False for c in classes}
    
    for class_name in classes:
        class_dir = os.path.join(dataset_dir, class_name)
        os.makedirs(class_dir, exist_ok=True)
        
        for idx in range(images_per_class):
            img = generate_crop_image(config["draw_fn"], class_name)
            
            # Apply slight noise/blur
            if np.random.rand() > 0.5:
                img = img.filter(ImageFilter.GaussianBlur(radius=0.4))
                
            img_path = os.path.join(class_dir, f"img_{idx}.jpg")
            img.save(img_path, "JPEG")
            
            if not sample_saved[class_name] and idx == 0:
                short_name = class_name.split("___")[-1].lower()
                test_sample_path = os.path.join(config["test_dir"], f"{crop_name.lower()}_{short_name}.jpg")
                img.save(test_sample_path, "JPEG")
                sample_saved[class_name] = True

    img_size = (224, 224)
    batch_size = 16
    
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path := dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=42,
        image_size=img_size,
        batch_size=batch_size
    )
    
    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path,
        validation_split=0.2,
        subset="validation",
        seed=42,
        image_size=img_size,
        batch_size=batch_size
    )
    
    normalization_layer = tf.keras.layers.Rescaling(1./255)
    train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
    val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))
    
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # ── CNN Model with Softmax Output Layer ──────────────────────
    inputs = tf.keras.Input(shape=(224, 224, 3), name="input")
    x = tf.keras.layers.Conv2D(32, 3, activation="relu")(inputs)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    
    x = tf.keras.layers.Conv2D(64, 3, activation="relu")(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    
    x = tf.keras.layers.Conv2D(128, 3, activation="relu")(x)
    x = tf.keras.layers.BatchNormalization()(x)
    x = tf.keras.layers.MaxPooling2D()(x)
    
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    
    x = tf.keras.layers.Dense(128, activation="relu")(x)
    x = tf.keras.layers.Dropout(0.4)(x)
    
    outputs = tf.keras.layers.Dense(len(classes), activation="softmax", name="softmax_output")(x)
    
    model = tf.keras.Model(inputs=inputs, outputs=outputs, name=f"{crop_name.lower()}_cnn")
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    model.fit(train_ds, validation_data=val_ds, epochs=8)
    
    val_loss, val_acc = model.evaluate(val_ds)
    print(f"[{crop_name}] Validation Accuracy: {val_acc * 100:.2f}% | Loss: {val_loss:.4f}")
    
    model.save(config["h5_name"])
    print(f"[{crop_name}] Saved H5 model to {config['h5_name']}")
    
    saved_model_dir = f"./saved_model_{crop_name.lower()}"
    tf.saved_model.save(model, saved_model_dir)
    
    onnx_path = config["onnx_name"]
    os.system(f"python -m tf2onnx.convert --saved-model {saved_model_dir} --output {onnx_path} --opset 13")
    
    if os.path.exists(onnx_path):
        print(f"[{crop_name}] Exported ONNX model to {onnx_path} ({os.path.getsize(onnx_path)} bytes)")

def main():
    for crop_name, config in CROPS_CONFIG.items():
        train_and_export_crop(crop_name, config)

if __name__ == "__main__":
    main()
