<script setup lang="ts">

import {
  faCamera,
  faCopy,
  faExternalLink,
  faImage,
  faPaste,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { Html5Qrcode } from "html5-qrcode";
import { computed, nextTick, onUnmounted, ref } from 'vue';
import { useToast } from 'vue-toast-notification';

const $toast = useToast();
const result = ref<string>();

const isMac = navigator.userAgent.includes('Mac OS X');

function browseFiles() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.style.display = 'none';
  input.addEventListener('change', () => {
    if (!input.files?.[0]) {
      return;
    }

    handleQRCodeImage(input.files[0]);

    input.remove();
  });

  input.addEventListener('cancel', () => {
    input.remove();
  });

  document.body.appendChild(input);
  input.click();
}

async function pasted() {
  const items = await navigator.clipboard.read();

  let types = items[0].types;

  if (types.length === 0) {
    $toast.error('無法取得剪貼簿內的檔案.');
    return;
  }

  types = types.slice().sort();

  const type = types[0];

  items[0].getType(type).then((blob) => {
    handleQRCodeImage(new File([blob], 'image.png', { type }));
  });
}

function onDragOver(e: DragEvent) {
  const el = e.currentTarget as HTMLDivElement;

  el.classList.add('l-dragarea--hover');
}

function onDragLeave(e: DragEvent) {
  const el = e.currentTarget as HTMLDivElement;

  el.classList.remove('l-dragarea--hover');
}

function onDrop(e: DragEvent) {
  e.stopPropagation();
  e.preventDefault();
  const el = e.currentTarget as HTMLDivElement;

  el.classList.remove('l-dragarea--hover');

  const file = e.dataTransfer?.files[0];

  if (!file) {
    return;
  }

  handleQRCodeImage(file);
}

const scanning = ref(false);
let scanner: Html5Qrcode;

async function startScan() {
  scanning.value = true;

  await nextTick();

  const devices = await Html5Qrcode.getCameras();

  if (!(devices && devices.length)) {
    $toast.error('沒有可用相機');
    return;
  }

  const cameraId = devices[0].id;

  scanner = getHtmlQrCode('scanner');

  scanner.start(
    { facingMode: 'environment' },
    {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    },
    async (text) => {
      const canvas = document.querySelector<HTMLCanvasElement>('#scanner canvas')!;
      canvas.toBlob((blob) => {
        displayImage.value = URL.createObjectURL(blob!);
      });

      scanning.value = false;

      await nextTick();

      result.value = text;

      scanner.stop();
    },
    () => {
      //
    }
  )
}

function stopScan() {
  if (scanner) {
    scanner.stop();
    scanning.value = false;
  }
}

function getHtmlQrCode(id = 'reader', verbose = false) {
  return new Html5Qrcode(id, verbose);
}

const displayImage = ref('https://place-hold.it/150x150?text=QRCode');

async function handleQRCodeImage(file: File) {
  if (!file.type.startsWith('image/')) {
    $toast.error('無法分析 QR Code');
    return;
  }
  
  try {
    result.value = await getHtmlQrCode().scanFile(file);
  } catch (e) {
    $toast.error('無法分析 QR Code');

    throw e;
  }

  displayImage.value = URL.createObjectURL(file);
}

const isUrl = computed(() => {
  if (!result.value) {
    return false;
  }

  return result.value.startsWith('http://') || result.value.startsWith('https://');
});

async function copyResult() {
  await navigator.clipboard.writeText(result.value || '');

  $toast.success('複製成功');
}

function goToResult() {
  const v = confirm(`您確定要前往: "${result.value}"?`);

  if (v && result) {
    window.open(result.value);
  }
}

document.addEventListener('paste', systemPaste)

function systemPaste(e: ClipboardEvent) {
  const files = e.clipboardData?.files;
  
  const file = files?.[0];

  if (!file) {
    return;
  }

  handleQRCodeImage(file);
}

onUnmounted(() => {
  document.removeEventListener('paste', systemPaste);
})
</script>

<template>
  <div class="d-flex flex-column gap-4">
    <div class="card my-4 bg-light">
      <div class="card-body row">

        <div class="col-lg-6">
          <template v-if="!scanning">
            <div class="l-dragarea"
              @dragover.prevent="onDragOver"
              @dragleave.prevent="onDragLeave"
              @drop.prevent="onDrop"
            >
              <div class="lead mb-3">
                <FontAwesomeIcon :icon="faUpload" />
                拖拉圖片到這裡上傳
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-primary" style="width: 150px"
                  @click="browseFiles">
                  <FontAwesomeIcon :icon="faImage" />
                  瀏覽檔案
                </button>
                <button type="button" class="btn btn-success" style="width: 150px"
                  @click="pasted">
                  <FontAwesomeIcon :icon="faPaste" />
                  貼上
                </button>
              </div>
              <div>
                <button type="button" class="btn btn-lg btn-outline-dark" style="width: 150px"
                  @click="startScan">
                  <FontAwesomeIcon :icon="faCamera" />
                  掃描
                </button>
              </div>
            </div>

            <div id="reader" style="display: none"></div>
          </template>
          <template v-else>
            <div class="position-relative">
              <div id="scanner" height="400px"></div>
              <div class="text-center l-stop-actions ">
                <button type="button" class="btn btn-secondary"
                  @click="stopScan">
                  停止掃描
                </button>
              </div>
            </div>
          </template>
        </div>

        <div class="col-lg-6">
          <div class="px-4 py-4 d-flex flex-column gap-4 h-100">
            <div>
              <h2 class=" fw-bold text-body-emphasis mb-3">QRCode 掃描與安全檢查工具</h2>
              <div class="">
                <p class="lead">
                  上傳或貼上您的 QRCode，立即檢查網址是否安全
                </p>
                <p class="">
                  可以用
                  <kbd v-if="isMac">Command</kbd>
                  <kbd v-else>Ctrl</kbd>
                  +
                  <kbd>V</kbd>
                  貼上圖片檔案
                </p>
              </div>
            </div>

            <div class="card mt-auto">
              <div class="card-body d-flex flex-column flex-md-row gap-3">
                <div>
                  <img ref="uploadedQrcode" :src="displayImage"
                    class="rounded d-block mx-auto"
                    alt="qrcode" style="width: 100px">
                </div>

                <div class="d-flex flex-column gap-2 flex-grow-1">
                  <div class="">
                    解碼後
                  </div>
                  <textarea class="form-control" disabled :value="result"
                    placeholder="請先上傳 QRCode"
                  ></textarea>
                  <div class="d-flex gap-2" v-if="result">
                    <button type="button" class="btn btn-outline-primary"
                      style="width: 100px"
                      @click="copyResult"
                    >
                      <FontAwesomeIcon :icon="faCopy" />
                      複製
                    </button>

                    <button v-if="isUrl"
                      type="button" class="btn btn-dark"
                      style="width: 150px"
                      @click="goToResult"
                    >
                      <FontAwesomeIcon :icon="faExternalLink" />
                      前往
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.l-dragarea {
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  height: 350px;
  border: 2px dashed var(--bs-gray-400);
  border-radius: var(--bs-border-radius);
}

.l-dragarea--hover {
  background-color: var(--bs-gray-300);
}

.l-stop-actions {
  position: static;
  transform: none;
  margin-top: 1rem;
}

@media (min-width: 991px) {
  .l-stop-actions {
    position: absolute;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%)
  }
}
</style>
