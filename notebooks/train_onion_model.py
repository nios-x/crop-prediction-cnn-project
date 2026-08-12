import os
import numpy as np
import tensorflow as tf
from PIL import Image, ImageDraw, ImageFilter
import tf2onnx

def create_onion_dataset():
    """Generates distinct synthetic onion leaf dataset for training the CNN model."""
    classes = [
        "Onion___Purple_blotch",
        "Onion___Stemphylium_blight",
        "Onion___Downy_mildew",
        "Onion___healthy"
    ]
    
    dataset_dir = "./dataset_onion"
    os.makedirs(dataset_dir, exist_ok=True)
    
    test_img_dir = "../public/test-images/onion"
    os.makedirs(test_img_dir, exist_ok=True)
    
    np.random.seed(42)
    images_per_class = 200

    sample_saved = {c: False for c in classes}
    
    for class_name in classes:
        class_dir = os.path.join(dataset_dir, class_name)
        os.makedirs(class_dir, exist_ok=True)
        
        for idx in range(images_per_class):
            img = Image.new("RGB", (224, 224), color=(240, 240, 235))
            draw = ImageDraw.Draw(img)
            
            # Base leaf blade
            leaf_x1 = np.random.randint(60, 90)
            leaf_x2 = np.random.randint(130, 160)
            
            if class_name == "Onion___healthy":
                leaf_color = (
                    np.random.randint(20, 50),
                    np.random.randint(160, 220),
                    np.random.randint(30, 70)
                )
                draw.polygon(
                    [(leaf_x1, 224), (leaf_x1 + 20, 10), (leaf_x2 - 20, 10), (leaf_x2, 224)],
                    fill=leaf_color
                )
                draw.line([(leaf_x1 + 25, 224), (leaf_x1 + 25, 10)], fill=(10, 120, 20), width=3)
                draw.line([(leaf_x2 - 25, 224), (leaf_x2 - 25, 10)], fill=(10, 120, 20), width=3)

            elif class_name == "Onion___Purple_blotch":
                leaf_color = (60, 130, 50)
                draw.polygon(
                    [(leaf_x1, 224), (leaf_x1 + 20, 10), (leaf_x2 - 20, 10), (leaf_x2, 224)],
                    fill=leaf_color
                )
                # Purple blotches with yellow halo
                for _ in range(np.random.randint(3, 6)):
                    cx = np.random.randint(leaf_x1 + 15, leaf_x2 - 15)
                    cy = np.random.randint(40, 180)
                    r = np.random.randint(12, 22)
                    draw.ellipse([cx - r - 6, cy - r - 6, cx + r + 6, cy + r + 6], fill=(230, 210, 30))
                    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(120, 20, 140))
                    draw.ellipse([cx - r//2, cy - r//2, cx + r//2, cy + r//2], fill=(60, 0, 80))

            elif class_name == "Onion___Stemphylium_blight":
                leaf_color = (130, 140, 60)
                draw.polygon(
                    [(leaf_x1, 224), (leaf_x1 + 20, 10), (leaf_x2 - 20, 10), (leaf_x2, 224)],
                    fill=leaf_color
                )
                # Elongated tan & dark brown lesions
                for _ in range(np.random.randint(4, 7)):
                    cx = np.random.randint(leaf_x1 + 10, leaf_x2 - 10)
                    cy = np.random.randint(30, 180)
                    rx, ry = np.random.randint(6, 12), np.random.randint(20, 38)
                    draw.ellipse([cx - rx - 4, cy - ry - 4, cx + rx + 4, cy + ry + 4], fill=(240, 190, 80))
                    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(100, 50, 15))

            elif class_name == "Onion___Downy_mildew":
                leaf_color = (110, 150, 80)
                draw.polygon(
                    [(leaf_x1, 224), (leaf_x1 + 20, 10), (leaf_x2 - 20, 10), (leaf_x2, 224)],
                    fill=leaf_color
                )
                # Pale yellow patches with grayish-violet velvety mold
                for _ in range(np.random.randint(2, 5)):
                    cx = np.random.randint(leaf_x1 + 10, leaf_x2 - 10)
                    cy = np.random.randint(40, 170)
                    rx, ry = np.random.randint(15, 28), np.random.randint(25, 45)
                    draw.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=(210, 220, 140))
                    draw.ellipse([cx - rx//2, cy - ry//2, cx + rx//2, cy + ry//2], fill=(140, 130, 160))

            if np.random.rand() > 0.6:
                img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
                
            img_path = os.path.join(class_dir, f"img_{idx}.jpg")
            img.save(img_path, "JPEG")
            
            # Save sample test images to public/test-images/onion/
            if not sample_saved[class_name] and idx == 0:
                short_name = class_name.replace("Onion___", "").lower()
                test_sample_path = os.path.join(test_img_dir, f"onion_{short_name}.jpg")
                img.save(test_sample_path, "JPEG")
                print(f"Saved sample test image: {test_sample_path}")
                sample_saved[class_name] = True
                
    print(f"Onion dataset created with {len(classes)} classes.")
    return dataset_dir, classes

def train_and_export_onion_cnn():
    dataset_path, class_names = create_onion_dataset()
    print("Class names:", class_names)
    num_classes = len(class_names)
    img_size = (224, 224)
    batch_size = 16
    
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_path,
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
    
    # Preprocessing
    normalization_layer = tf.keras.layers.Rescaling(1./255)
    train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
    val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))
    
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

    # ── CNN Model Architecture with Softmax Output Layer ────────────────────────
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
    x = tf.keras.layers.Dropout(0.5)(x)
    
    # Output layer with Softmax activation for class probability distribution
    outputs = tf.keras.layers.Dense(num_classes, activation="softmax", name="softmax_output")(x)
    
    model = tf.keras.Model(inputs=inputs, outputs=outputs, name="onion_disease_cnn")
    
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"]
    )
    
    model.summary()
    
    print("Training Onion Health CNN model...")
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=10
    )
    
    val_loss, val_acc = model.evaluate(val_ds)
    print(f"Validation Accuracy: {val_acc * 100:.2f}% | Validation Loss: {val_loss:.4f}")
    
    # Save H5 model
    h5_path = "../public/Onion.h5"
    model.save(h5_path)
    print(f"Saved Keras H5 model to {h5_path}")
    
    # Export to SavedModel format first for clean tf2onnx conversion
    saved_model_dir = "./onion_saved_model"
    tf.saved_model.save(model, saved_model_dir)
    
    onnx_path = "../public/Onion.onnx"
    os.system(f"python -m tf2onnx.convert --saved-model {saved_model_dir} --output {onnx_path} --opset 13")
    
    if os.path.exists(onnx_path):
        print(f"Successfully generated ONNX model at {onnx_path} (Size: {os.path.getsize(onnx_path)} bytes)")
    else:
        print("Error: ONNX file was not created.")

if __name__ == "__main__":
    train_and_export_onion_cnn()
