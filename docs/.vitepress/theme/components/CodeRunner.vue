<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { Sandbox } from "vitepress-plugin-sandpack";

const props = withDefaults(
  defineProps<{
    code: string;
    lang?: string;
    template?: "vanilla" | "vanilla-ts";
  }>(),
  {
    lang: "js",
    template: "vanilla",
  }
);

const open = ref(false);

const sourceCode = computed(() => decodeURIComponent(props.code));

function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") open.value = false;
}

watch(open, (visible) => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = visible ? "hidden" : "";
});

onMounted(() => {
  window.addEventListener("keydown", onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", onKeydown);
  if (typeof document !== "undefined") {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <button
    type="button"
    class="vp-code-run-btn"
    title="运行代码"
    aria-label="运行代码"
    @click="open = true"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M8 5v14l11-7z"
      />
    </svg>
  </button>

  <Teleport to="body">
    <Transition name="vp-code-runner-fade">
      <div
        v-if="open"
        class="vp-code-runner-overlay"
        @click.self="open = false"
      >
        <div
          class="vp-code-runner-panel"
          role="dialog"
          aria-modal="true"
          aria-label="代码运行器"
        >
          <header class="vp-code-runner-header">
            <div class="vp-code-runner-title">
              <span class="vp-code-runner-dot" />
              代码运行器
              <span class="vp-code-runner-lang">{{ lang }}</span>
            </div>
            <button
              type="button"
              class="vp-code-runner-close"
              aria-label="关闭"
              @click="open = false"
            >
              ×
            </button>
          </header>

          <ClientOnly>
            <div class="vp-code-runner-body">
              <Sandbox
                :template="template"
                showConsole
                :preview-height="80"
              >
                <div>
                  <pre>{{ sourceCode }}</pre>
                </div>
              </Sandbox>
            </div>
          </ClientOnly>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
